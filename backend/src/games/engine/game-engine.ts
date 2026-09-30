import type { GameType, ScoreBreakdownView } from '@world-challenge/shared';

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
  combo: number;
  allPlayersAnswered: boolean;
  breakdown: ScoreBreakdownView;
}

export interface ScoredAnswer {
  isCorrect: boolean;
  points: number;
  breakdown: ScoreBreakdownView;
}

export interface GameEngine {
  getGameType(): GameType;
  selectQuestionIds(count: number): Promise<string[]>;
  scoreAnswer(input: {
    questionId: string;
    answer: string;
    responseMs: number;
    previousStreak: number;
  }): Promise<ScoredAnswer>;
}
