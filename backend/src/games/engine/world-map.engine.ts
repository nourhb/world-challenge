import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GameType,
  MAP_TIME_LIMIT_MS,
  QUIZ_ROUND_COUNT,
} from '@world-challenge/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { ScoringService } from '../scoring/scoring.service';
import type { GameEngine } from './game-engine';
import { haversineKm, parseCoordinateAnswer } from './geo';
import { shuffle } from './shuffle';

@Injectable()
export class WorldMapEngine implements GameEngine {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scoring: ScoringService,
  ) {}

  getGameType(): GameType {
    return GameType.WORLD_MAP;
  }

  async selectQuestionIds(count = QUIZ_ROUND_COUNT): Promise<string[]> {
    const questions = await this.prisma.question.findMany({
      where: { gameType: GameType.WORLD_MAP, isActive: true },
      select: { id: true },
    });

    if (questions.length < count) {
      throw new NotFoundException(
        `World Map needs at least ${count} seeded questions`,
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

    const guess = parseCoordinateAnswer(input.answer);
    const target = parseCoordinateAnswer(question.correctAnswer);
    if (!guess || !target) {
      return { isCorrect: false, points: 0 };
    }

    const distanceKm = haversineKm(guess, target);
    const scored = this.scoring.scoreMapGuess({
      distanceKm,
      responseMs: input.responseMs,
      difficulty: question.difficulty,
      timeLimitMs: MAP_TIME_LIMIT_MS,
    });
    return { isCorrect: scored.isCorrect, points: scored.points };
  }
}
