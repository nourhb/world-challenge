import { Injectable, NotFoundException } from '@nestjs/common';
import { GameType, QUIZ_ROUND_COUNT } from '@world-challenge/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import type { GameEngine } from './game-engine';
import { shuffle } from './shuffle';

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
    const questions = await this.prisma.question.findMany({
      where: { gameType: GameType.COUNTRY_QUIZ, isActive: true },
      select: { id: true },
    });

    if (questions.length < count) {
      throw new NotFoundException(
        `Country Quiz needs at least ${count} seeded questions`,
      );
    }

    return shuffle(questions.map((question) => question.id)).slice(0, count);
  }

  async scoreAnswer(input: {
    questionId: string;
    answer: string;
    responseMs: number;
  }): Promise<{ isCorrect: boolean; points: number }> {
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
    });
    return { isCorrect, points: scored.points };
  }
}

export function normalizeAnswer(value: string): string {
  return value.trim().toLowerCase();
}
