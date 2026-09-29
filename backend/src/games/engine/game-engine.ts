import type { GameType } from '@world-challenge/shared';

export interface AnswerSubmission {
  sessionId: string;
  userId: string;
  questionId: string;
  answer: string;
}

export interface AnswerResult {
  questionId: string;
  accepted: boolean;
  alreadyAnswered: boolean;
  isCorrect: boolean;
  points: number;
  allPlayersAnswered: boolean;
}

export interface GameEngine {
  getGameType(): GameType;
  selectQuestionIds(count: number): Promise<string[]>;
  scoreAnswer(input: {
    questionId: string;
    answer: string;
    responseMs: number;
  }): Promise<{ isCorrect: boolean; points: number }>;
}
