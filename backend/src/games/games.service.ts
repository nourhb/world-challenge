import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  GameMode,
  GameStatus,
  GameType,
  isPlayableGameType,
  MAP_TIME_LIMIT_MS,
  QUIZ_ROUND_COUNT,
  QUIZ_TIME_LIMIT_MS,
  type GameCatalogItem,
  type GameResultsView,
  type GameSessionView,
} from '@world-challenge/shared';
import { PrismaService } from '../prisma/prisma.service';
import { GameEngineFactory } from './engine/game-engine.factory';
import type { AnswerResult } from './engine/game-engine';
import { RewardsService } from './rewards/rewards.service';
import { toGameSessionView } from './session.mapper';
import type { CreateSessionDto } from './dto/create-session.dto';

const ACTIVE_STATUSES = [
  GameStatus.WAITING,
  GameStatus.READY,
  GameStatus.COUNTDOWN,
  GameStatus.PLAYING,
  GameStatus.ROUND_COMPLETE,
  GameStatus.NEXT_ROUND,
];

@Injectable()
export class GamesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly engines: GameEngineFactory,
    private readonly rewards: RewardsService,
  ) {}

  async listCatalog(): Promise<GameCatalogItem[]> {
    const games = await this.prisma.game.findMany({
      orderBy: { name: 'asc' },
    });
    return games.map((game) => ({
      id: game.id,
      type: game.type as GameType,
      name: game.name,
      description: game.description,
      isActive: game.isActive,
    }));
  }

  async createSession(
    userId: string,
    dto: CreateSessionDto,
  ): Promise<GameSessionView> {
    await this.assertPlayableUser(userId);

    if (!isPlayableGameType(dto.gameType)) {
      throw new BadRequestException('That game is not available yet');
    }

    const game = await this.prisma.game.findUnique({
      where: { type: dto.gameType },
    });
    if (!game?.isActive) {
      throw new NotFoundException('Game is not available');
    }

    const solo = dto.mode === GameMode.SOLO;
    if (solo && dto.invitedUserId) {
      throw new BadRequestException('Solo games cannot invite another player');
    }
    if (!solo && dto.invitedUserId === userId) {
      throw new BadRequestException('You cannot challenge yourself');
    }
    if (dto.invitedUserId) {
      await this.assertPlayableUser(dto.invitedUserId);
      const blocked = await this.prisma.block.findFirst({
        where: {
          OR: [
            { blockerId: userId, blockedId: dto.invitedUserId },
            { blockerId: dto.invitedUserId, blockedId: userId },
          ],
        },
      });
      if (blocked) {
        throw new ForbiddenException('You cannot challenge this player');
      }
    }

    const questionIds = await this.engines
      .getEngine(dto.gameType)
      .selectQuestionIds(QUIZ_ROUND_COUNT);

    const session = await this.prisma.gameSession.create({
      data: {
        gameId: game.id,
        status: GameStatus.WAITING,
        mode: dto.mode,
        maxPlayers: solo ? 1 : 2,
        questionIds,
        hostUserId: userId,
        invitedUserId: dto.invitedUserId,
        players: {
          create: { userId },
        },
      },
    });

    return this.getSession(userId, session.id);
  }

  async joinSession(userId: string, sessionId: string): Promise<GameSessionView> {
    await this.assertPlayableUser(userId);
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: { players: true },
    });
    if (!session) {
      throw new NotFoundException('Game session was not found');
    }
    if (session.status !== GameStatus.WAITING) {
      const alreadyIn = session.players.some((player) => player.userId === userId);
      if (alreadyIn) {
        return this.getSession(userId, sessionId);
      }
      throw new ConflictException('This game is no longer accepting players');
    }
    if (session.players.some((player) => player.userId === userId)) {
      return this.getSession(userId, sessionId);
    }
    if (session.players.length >= session.maxPlayers) {
      throw new ConflictException('This game is full');
    }
    if (session.invitedUserId && session.invitedUserId !== userId) {
      throw new ForbiddenException('This challenge was sent to another player');
    }

    await this.prisma.gamePlayer.create({
      data: { sessionId, userId },
    });
    return this.getSession(userId, sessionId);
  }

  async listMine(userId: string): Promise<GameSessionView[]> {
    const sessions = await this.prisma.gameSession.findMany({
      where: {
        status: { in: ACTIVE_STATUSES },
        OR: [
          { hostUserId: userId },
          { invitedUserId: userId },
          { players: { some: { userId } } },
        ],
      },
      include: {
        game: true,
        players: { include: { user: { include: { country: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      sessions.map(async (session) => {
        const question = await this.currentQuestionRecord(session);
        return toGameSessionView(session, question);
      }),
    );
  }

  async getSession(userId: string, sessionId: string): Promise<GameSessionView> {
    const session = await this.loadSession(sessionId);
    this.assertMemberOrInvitee(session, userId);
    const question = await this.currentQuestionRecord(session);
    return toGameSessionView(session, question);
  }

  async markReady(
    userId: string,
    sessionId: string,
  ): Promise<{ session: GameSessionView; shouldStart: boolean }> {
    const session = await this.loadSession(sessionId);
    const player = session.players.find((entry) => entry.userId === userId);
    if (!player) {
      throw new ForbiddenException('Join the game before ready-up');
    }
    if (session.status !== GameStatus.WAITING && session.status !== GameStatus.READY) {
      return { session: toGameSessionView(session, null), shouldStart: false };
    }

    await this.prisma.gamePlayer.update({
      where: { id: player.id },
      data: { ready: true },
    });

    const refreshed = await this.loadSession(sessionId);
    const allReady =
      refreshed.players.length === refreshed.maxPlayers &&
      refreshed.players.every((entry) => entry.ready);
    if (allReady) {
      await this.prisma.gameSession.update({
        where: { id: sessionId },
        data: { status: GameStatus.READY },
      });
    }

    const view = await this.getSession(userId, sessionId);
    return { session: view, shouldStart: allReady };
  }

  async beginCountdown(sessionId: string): Promise<GameSessionView> {
    const session = await this.loadSession(sessionId);
    if (
      session.status !== GameStatus.READY &&
      session.status !== GameStatus.WAITING
    ) {
      return toGameSessionView(session, null);
    }

    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: GameStatus.COUNTDOWN,
        startedAt: session.startedAt ?? new Date(),
      },
    });
    return this.getSession(session.hostUserId, sessionId);
  }

  async openRound(sessionId: string): Promise<GameSessionView> {
    const session = await this.loadSession(sessionId);
    const nextRound = session.currentRound + 1;
    if (nextRound > session.questionIds.length) {
      return this.finishSession(sessionId);
    }

    const now = new Date();
    const timeLimitMs =
      session.game.type === GameType.WORLD_MAP
        ? MAP_TIME_LIMIT_MS
        : QUIZ_TIME_LIMIT_MS;
    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: GameStatus.PLAYING,
        currentRound: nextRound,
        currentQuestionStartedAt: now,
        roundEndsAt: new Date(now.getTime() + timeLimitMs),
      },
    });
    return this.getSession(session.hostUserId, sessionId);
  }

  async submitAnswer(
    userId: string,
    sessionId: string,
    questionId: string,
    answer: string,
  ): Promise<AnswerResult> {
    const session = await this.loadSession(sessionId);
    const player = session.players.find((entry) => entry.userId === userId);
    if (!player) {
      throw new ForbiddenException('You are not in this game');
    }
    if (session.status !== GameStatus.PLAYING) {
      throw new ConflictException('This round is not accepting answers');
    }

    const currentQuestionId = session.questionIds[session.currentRound - 1];
    if (!currentQuestionId || currentQuestionId !== questionId) {
      throw new BadRequestException('That question is not active');
    }
    if (session.roundEndsAt && session.roundEndsAt.getTime() < Date.now()) {
      throw new ConflictException('The timer for this question has ended');
    }

    const existing = await this.prisma.gameAnswer.findUnique({
      where: {
        sessionId_playerId_questionId: {
          sessionId,
          playerId: userId,
          questionId,
        },
      },
    });
    if (existing) {
      return {
        questionId,
        accepted: false,
        alreadyAnswered: true,
        isCorrect: existing.isCorrect,
        points: existing.points,
        allPlayersAnswered: await this.haveAllAnswered(sessionId, questionId),
      };
    }

    const startedAt = session.currentQuestionStartedAt ?? new Date();
    const responseMs = Math.max(0, Date.now() - startedAt.getTime());
    const engine = this.engines.getEngine(session.game.type as GameType);
    const scored = await engine.scoreAnswer({
      questionId,
      answer,
      responseMs,
    });

    await this.prisma.$transaction([
      this.prisma.gameAnswer.create({
        data: {
          sessionId,
          playerId: userId,
          questionId,
          answer,
          isCorrect: scored.isCorrect,
          points: scored.points,
          responseMs,
        },
      }),
      this.prisma.gamePlayer.update({
        where: { id: player.id },
        data: { score: { increment: scored.points } },
      }),
    ]);

    return {
      questionId,
      accepted: true,
      alreadyAnswered: false,
      isCorrect: scored.isCorrect,
      points: scored.points,
      allPlayersAnswered: await this.haveAllAnswered(sessionId, questionId),
    };
  }

  async completeRound(sessionId: string): Promise<{
    session: GameSessionView;
    correctAnswer: string;
    explanation: string | null;
    isLastRound: boolean;
  }> {
    const session = await this.loadSession(sessionId);
    const questionId = session.questionIds[session.currentRound - 1];
    if (!questionId) {
      throw new NotFoundException('No active question');
    }
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException('Question was not found');
    }

    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: { status: GameStatus.ROUND_COMPLETE },
    });

    const view = await this.getSession(session.hostUserId, sessionId);
    return {
      session: view,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isLastRound: session.currentRound >= session.questionIds.length,
    };
  }

  async finishSession(sessionId: string): Promise<GameSessionView> {
    await this.prisma.gameSession.update({
      where: { id: sessionId },
      data: {
        status: GameStatus.FINISHED,
        finishedAt: new Date(),
      },
    });
    const host = await this.prisma.gameSession.findUniqueOrThrow({
      where: { id: sessionId },
    });
    return this.getSession(host.hostUserId, sessionId);
  }

  async getResults(userId: string, sessionId: string): Promise<GameResultsView> {
    const session = await this.loadSession(sessionId);
    this.assertMemberOrInvitee(session, userId);
    return this.rewards.finalizeSession(sessionId);
  }

  private async haveAllAnswered(
    sessionId: string,
    questionId: string,
  ): Promise<boolean> {
    const session = await this.prisma.gameSession.findUniqueOrThrow({
      where: { id: sessionId },
      include: { players: true, answers: true },
    });
    return session.players.every((player) =>
      session.answers.some(
        (answer) =>
          answer.playerId === player.userId && answer.questionId === questionId,
      ),
    );
  }

  private async loadSession(sessionId: string) {
    const session = await this.prisma.gameSession.findUnique({
      where: { id: sessionId },
      include: {
        game: true,
        players: { include: { user: { include: { country: true } } } },
      },
    });
    if (!session) {
      throw new NotFoundException('Game session was not found');
    }
    return session;
  }

  private async currentQuestionRecord(session: {
    status: string;
    currentRound: number;
    questionIds: string[];
  }) {
    if (
      session.status !== GameStatus.PLAYING &&
      session.status !== GameStatus.ROUND_COMPLETE
    ) {
      return null;
    }
    const questionId = session.questionIds[session.currentRound - 1];
    if (!questionId) {
      return null;
    }
    return this.prisma.question.findUnique({
      where: { id: questionId },
      select: { id: true, prompt: true, options: true, imageUrl: true },
    });
  }

  private assertMemberOrInvitee(
    session: { hostUserId: string; invitedUserId: string | null; players: Array<{ userId: string }> },
    userId: string,
  ): void {
    const allowed =
      session.hostUserId === userId ||
      session.invitedUserId === userId ||
      session.players.some((player) => player.userId === userId);
    if (!allowed) {
      throw new ForbiddenException('You cannot view this game');
    }
  }

  private async assertPlayableUser(userId: string): Promise<void> {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
    });
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    if (user.isSuspended) {
      throw new ForbiddenException('Suspended accounts cannot play');
    }
  }
}
