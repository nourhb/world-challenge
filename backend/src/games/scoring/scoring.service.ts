import { Injectable } from '@nestjs/common';
import {
  comboMultiplier,
  MAP_CORRECT_WITHIN_KM,
  MAP_DISTANCE_SCORES,
  QUIZ_BASE_POINTS,
  QUIZ_MAX_SPEED_BONUS,
  QUIZ_TIME_LIMIT_MS,
  type ScoreBreakdownView,
} from '@world-challenge/shared';

export type ScoreBreakdown = ScoreBreakdownView;

@Injectable()
export class ScoringService {
  scoreQuizAnswer(input: {
    isCorrect: boolean;
    responseMs: number;
    difficulty: number;
    previousStreak?: number;
    timeLimitMs?: number;
  }): ScoreBreakdown {
    const timeLimitMs = input.timeLimitMs ?? QUIZ_TIME_LIMIT_MS;
    const clampedMs = Math.min(Math.max(input.responseMs, 0), timeLimitMs);
    const remainingRatio = input.isCorrect
      ? (timeLimitMs - clampedMs) / timeLimitMs
      : 0;
    const basePoints = input.isCorrect ? QUIZ_BASE_POINTS : 0;
    const speedBonus = input.isCorrect
      ? Math.round(QUIZ_MAX_SPEED_BONUS * remainingRatio)
      : 0;
    const difficultyMultiplier = difficultyToMultiplier(input.difficulty);
    const combo = input.isCorrect ? (input.previousStreak ?? 0) + 1 : 0;
    const comboScale = comboMultiplier(combo);
    const points = Math.round(
      (basePoints + speedBonus) * difficultyMultiplier * comboScale,
    );

    return {
      basePoints,
      speedBonus,
      difficultyMultiplier,
      combo,
      comboMultiplier: comboScale,
      points,
    };
  }

  scoreMapGuess(input: {
    distanceKm: number;
    responseMs: number;
    difficulty: number;
    previousStreak?: number;
    timeLimitMs?: number;
  }): ScoreBreakdown & { isCorrect: boolean } {
    const distancePoints = distanceToPoints(input.distanceKm);
    const isCorrect = input.distanceKm <= MAP_CORRECT_WITHIN_KM;
    const quiz = this.scoreQuizAnswer({
      isCorrect,
      responseMs: input.responseMs,
      difficulty: input.difficulty,
      previousStreak: input.previousStreak,
      timeLimitMs: input.timeLimitMs,
    });
    const points = Math.round(
      (distancePoints + quiz.speedBonus) *
        quiz.difficultyMultiplier *
        quiz.comboMultiplier,
    );
    return {
      ...quiz,
      basePoints: distancePoints,
      points,
      isCorrect,
    };
  }
}

export function distanceToPoints(distanceKm: number): number {
  if (distanceKm < 100) {
    return MAP_DISTANCE_SCORES.under100km;
  }
  if (distanceKm < 500) {
    return MAP_DISTANCE_SCORES.from100To500km;
  }
  if (distanceKm < 1500) {
    return MAP_DISTANCE_SCORES.from500To1500km;
  }
  if (distanceKm < 3000) {
    return MAP_DISTANCE_SCORES.from1500To3000km;
  }
  return MAP_DISTANCE_SCORES.over3000km;
}

export function difficultyToMultiplier(difficulty: number): number {
  const clamped = Math.min(Math.max(difficulty, 1), 5);
  return 1 + (clamped - 1) * 0.25;
}

export function emptyBreakdown(): ScoreBreakdownView {
  return {
    basePoints: 0,
    speedBonus: 0,
    difficultyMultiplier: 1,
    combo: 0,
    comboMultiplier: 1,
    points: 0,
  };
}
