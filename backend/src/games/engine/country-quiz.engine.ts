import { Injectable, NotFoundException } from '@nestjs/common';
import { GameType, QUIZ_ROUND_COUNT } from '@world-challenge/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import type { GameEngine, ScoredAnswer } from './game-engine';
import { selectStratifiedQuestionIds } from './select-questions';

@Injectable()
export class CountryQuizEngine implements GameEngine {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
  ) {}

  getGameType(): GameType {
    return GameType.COUNTRY_QUIZ;
  }

  async selectQuestionIds(count = QUIZ_ROUND_COUNT): Promise<string[]> {
    return selectStratifiedQuestionIds(this.prisma, GameType.COUNTRY_QUIZ, count);
  }

  async scoreAnswer(input: {
    questionId: string;
    answer: string;
    responseMs: number;
    previousStreak: number;
  }): Promise<ScoredAnswer> {
    const question = await this.prisma.question.findUnique({
      where: { id: input.questionId },
    });
    if (!question || !question.isActive) {
      throw new NotFoundException('Question was not found');
    }

    const isCorrect =
      normalizeAnswer(question.correctAnswer) === normalizeAnswer(input.answer);
    const scored = this.scoring.scoreQuizAnswer({
      isCorrect,
      responseMs: input.responseMs,
      difficulty: question.difficulty,
      previousStreak: input.previousStreak,
    });
    return { isCorrect, points: scored.points, breakdown: scored };
  }
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}
