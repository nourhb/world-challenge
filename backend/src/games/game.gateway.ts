import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  QUIZ_COUNTDOWN_MS,
  type GameResultsView,
  type GameSessionView,
} from '@world-challenge/shared';
import type { Server, Socket } from 'socket.io';
import { GamesService } from './games.service';

interface AccessPayload {
  sub: string;
  username: string;
}

@WebSocketGateway({
  cors: { origin: true, credentials: true },
})
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(GameGateway.name);
  private readonly roundTimers = new Map<string, NodeJS.Timeout>();
  private readonly closingRounds = new Set<string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly gamesService: GamesService,
  ) {}

  handleConnection(client: Socket): void {
    const token = readHandshakeToken(client);
    if (!token) {
      client.emit('game:error', { message: 'Missing access token' });
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<AccessPayload>(token);
      client.data.userId = payload.sub;
    } catch {
      client.emit('game:error', { message: 'Invalid access token' });
      client.disconnect();
    }
  }

  @SubscribeMessage('game:join')
  async join(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId?: string },
  ): Promise<void> {
    try {
      const userId = this.userId(client);
      const sessionId = this.requireSessionId(body.sessionId);
      const session = await this.gamesService.joinSession(userId, sessionId);
      await client.join(roomName(sessionId));
      client.emit('game:joined', { session });
      this.server.to(roomName(sessionId)).emit('game:player_joined', { session });

      if (session.mode === 'SOLO' && session.status === 'WAITING') {
        const { session: readied, shouldStart } = await this.gamesService.markReady(
          userId,
          sessionId,
        );
        this.server.to(roomName(sessionId)).emit('game:player_ready', {
          session: readied,
        });
        if (shouldStart) {
          await this.startCountdown(sessionId);
        }
      }
    } catch (error) {
      this.emitError(client, error);
    }
  }

  @SubscribeMessage('game:ready')
  async ready(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId?: string },
  ): Promise<void> {
    try {
      const userId = this.userId(client);
      const sessionId = this.requireSessionId(body.sessionId);
      const { session, shouldStart } = await this.gamesService.markReady(
        userId,
        sessionId,
      );
      this.server.to(roomName(sessionId)).emit('game:player_ready', { session });
      if (shouldStart) {
        await this.startCountdown(sessionId);
      }
    } catch (error) {
      this.emitError(client, error);
    }
  }

  @SubscribeMessage('game:answer')
  async answer(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId?: string; questionId?: string; answer?: string },
  ): Promise<void> {
    try {
      const userId = this.userId(client);
      const sessionId = this.requireSessionId(body.sessionId);
      if (!body.questionId || !body.answer) {
        throw new Error('Question and answer are required');
      }
      const result = await this.gamesService.submitAnswer(
        userId,
        sessionId,
        body.questionId,
        body.answer,
      );
      client.emit('game:answer_result', result);
      if (result.allPlayersAnswered) {
        await this.closeRound(sessionId);
      }
    } catch (error) {
      this.emitError(client, error);
    }
  }

  @SubscribeMessage('game:leave')
  async leave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { sessionId?: string },
  ): Promise<void> {
    if (body.sessionId) {
      await client.leave(roomName(body.sessionId));
    }
  }

  private async startCountdown(sessionId: string): Promise<void> {
    const session = await this.gamesService.beginCountdown(sessionId);
    this.server.to(roomName(sessionId)).emit('game:started', { session });
    setTimeout(() => {
      void this.sendQuestion(sessionId);
    }, QUIZ_COUNTDOWN_MS);
  }

  private async sendQuestion(sessionId: string): Promise<void> {
    try {
      const session = await this.gamesService.openRound(sessionId);
      if (!session.currentQuestion) {
        await this.finish(sessionId);
        return;
      }
      this.server.to(roomName(sessionId)).emit('game:question', {
        session,
        question: session.currentQuestion,
      });
      this.scheduleRoundClose(sessionId, session.currentQuestion.endsAt);
    } catch (error) {
      this.logger.error(error);
    }
  }

  private scheduleRoundClose(sessionId: string, endsAt: string): void {
    this.clearTimer(sessionId);
    const delay = Math.max(0, new Date(endsAt).getTime() - Date.now() + 40);
    const timer = setTimeout(() => {
      void this.closeRound(sessionId);
    }, delay);
    this.roundTimers.set(sessionId, timer);
  }

  private async closeRound(sessionId: string): Promise<void> {
    if (this.closingRounds.has(sessionId)) {
      return;
    }
    this.closingRounds.add(sessionId);
    this.clearTimer(sessionId);

    try {
      const closed = await this.gamesService.completeRound(sessionId);
      this.server.to(roomName(sessionId)).emit('game:round_complete', {
        session: closed.session,
        correctAnswer: closed.correctAnswer,
        explanation: closed.explanation,
      });

      if (closed.isLastRound) {
        await this.finish(sessionId);
        return;
      }

      this.server.to(roomName(sessionId)).emit('game:next_round', {
        session: closed.session,
      });
      setTimeout(() => {
        this.closingRounds.delete(sessionId);
        void this.sendQuestion(sessionId);
      }, 2_000);
    } catch (error) {
      this.closingRounds.delete(sessionId);
      this.logger.error(error);
    }
  }

  private async finish(sessionId: string): Promise<void> {
    this.clearTimer(sessionId);
    this.closingRounds.delete(sessionId);
    const session = await this.gamesService.finishSession(sessionId);
    const hostId = session.hostUserId;
    const results: GameResultsView = await this.gamesService.getResults(
      hostId,
      sessionId,
    );
    const finished: GameSessionView = await this.gamesService.getSession(
      hostId,
      sessionId,
    );
    this.server.to(roomName(sessionId)).emit('game:finished', { session: finished });
    this.server.to(roomName(sessionId)).emit('game:results', { results });
  }

  private userId(client: Socket): string {
    const userId = client.data.userId as string | undefined;
    if (!userId) {
      throw new Error('Unauthorized socket');
    }
    return userId;
  }

  private requireSessionId(sessionId: string | undefined): string {
    if (!sessionId) {
      throw new Error('sessionId is required');
    }
    return sessionId;
  }

  private clearTimer(sessionId: string): void {
    const timer = this.roundTimers.get(sessionId);
    if (timer) {
      clearTimeout(timer);
      this.roundTimers.delete(sessionId);
    }
  }

  private emitError(client: Socket, error: unknown): void {
    const message = error instanceof Error ? error.message : 'Game error';
    client.emit('game:error', { message });
  }
}

function roomName(sessionId: string): string {
  return `session:${sessionId}`;
}

function readHandshakeToken(client: Socket): string | null {
  const authToken = client.handshake.auth?.token;
  if (typeof authToken === 'string' && authToken.length > 0) {
    return authToken;
  }
  const header = client.handshake.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return null;
}
