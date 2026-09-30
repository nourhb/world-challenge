import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GameType,
  MAP_TIME_LIMIT_MS,
  QUIZ_ROUND_COUNT,
} from '@world-challenge/shared';
import { PrismaService } from '../../prisma/prisma.service';
import { emptyBreakdown, ScoringService } from '../scoring/scoring.service';
import type { GameEngine, ScoredAnswer } from './game-engine';
import { haversineKm, parseCoordinateAnswer } from './geo';
import { selectStratifiedQuestionIds } from './select-questions';

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
    return selectStratifiedQuestionIds(this.prisma, GameType.WORLD_MAP, count);
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

    const guess = parseCoordinateAnswer(input.answer);
    const target = parseCoordinateAnswer(question.correctAnswer);
    if (!guess || !target) {
      return { isCorrect: false, points: 0, breakdown: emptyBreakdown() };
    }

    const distanceKm = haversineKm(guess, target);
    const scored = this.scoring.scoreMapGuess({
      distanceKm,
      responseMs: input.responseMs,
      difficulty: question.difficulty,
      previousStreak: input.previousStreak,
      timeLimitMs: MAP_TIME_LIMIT_MS,
    });
    return { isCorrect: scored.isCorrect, points: scored.points, breakdown: scored };
  }
}
