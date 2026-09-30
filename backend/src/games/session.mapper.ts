import type { Prisma } from '@prisma/client';
import {
  currentCombo,
  GameMode,
  GameStatus,
  GameType,
  MAP_TIME_LIMIT_MS,
  QUIZ_TIME_LIMIT_MS,
  type GamePlayerView,
  type GameSessionView,
  type PublicQuestion,
} from '@world-challenge/shared';

type SessionRecord = Prisma.GameSessionGetPayload<{
  include: {
    game: true;
    players: {
      include: {
        user: { include: { country: true } };
      };
    };
    answers: true;
  };
}>;

type QuestionRecord = {
  id: string;
  prompt: string;
  options: Prisma.JsonValue;
  imageUrl: string | null;
  difficulty: number;
};

export function toGameSessionView(
  session: SessionRecord,
  currentQuestion: QuestionRecord | null,
): GameSessionView {
  const currentQuestionId =
    session.status === GameStatus.PLAYING ||
    session.status === GameStatus.ROUND_COMPLETE
      ? (session.questionIds[session.currentRound - 1] ?? null)
      : null;

  return {
    id: session.id,
    gameType: session.game.type as GameType,
    gameName: session.game.name,
    status: session.status as GameStatus,
    mode: session.mode as GameMode,
    maxPlayers: session.maxPlayers,
    currentRound: session.currentRound,
    totalRounds: session.questionIds.length,
    hostUserId: session.hostUserId,
    invitedUserId: session.invitedUserId,
    players: session.players.map((player) =>
      toPlayerView(player, session.answers, currentQuestionId),
    ),
    currentQuestion:
      currentQuestion && session.roundEndsAt
        ? toPublicQuestion(
            currentQuestion,
            session.currentRound,
            session.questionIds.length,
            session.roundEndsAt,
            session.game.type === GameType.WORLD_MAP
              ? MAP_TIME_LIMIT_MS
              : QUIZ_TIME_LIMIT_MS,
          )
        : null,
    startedAt: session.startedAt?.toISOString() ?? null,
    finishedAt: session.finishedAt?.toISOString() ?? null,
    createdAt: session.createdAt.toISOString(),
  };
}

export function toPublicQuestion(
  question: QuestionRecord,
  round: number,
  totalRounds: number,
  endsAt: Date,
  timeLimitMs = QUIZ_TIME_LIMIT_MS,
): PublicQuestion {
  return {
    questionId: question.id,
    prompt: question.prompt,
    options: asStringArray(question.options),
    imageUrl: question.imageUrl,
    round,
    totalRounds,
    timeLimitMs,
    endsAt: endsAt.toISOString(),
    difficulty: question.difficulty,
  };
}

export function toPlayerView(
  player: SessionRecord['players'][number],
  answers: SessionRecord['answers'],
  currentQuestionId: string | null,
): GamePlayerView {
  const ordered = answers
    .filter((answer) => answer.playerId === player.userId)
    .sort((left, right) => left.createdAt.getTime() - right.createdAt.getTime());

  return {
    userId: player.userId,
    username: player.user.username,
    avatarUrl: player.user.avatarUrl,
    countryName: player.user.country.name,
    countryFlag: player.user.country.flagEmoji,
    score: player.score,
    ready: player.ready,
    xpAwarded: player.xpAwarded,
    combo: currentCombo(ordered.map((answer) => answer.isCorrect)),
    answeredThisRound: currentQuestionId
      ? ordered.some((answer) => answer.questionId === currentQuestionId)
      : false,
  };
}

export function asStringArray(value: Prisma.JsonValue): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}
