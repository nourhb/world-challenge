import { ScoringService } from './scoring.service';

describe('ScoringService', () => {
  const service = new ScoringService();

  it('awards base points and a speed bonus for a fast correct answer', () => {
    const result = service.scoreQuizAnswer({
      isCorrect: true,
      responseMs: 0,
      difficulty: 1,
      timeLimitMs: 20_000,
    });

    expect(result.basePoints).toBe(100);
    expect(result.speedBonus).toBe(50);
    expect(result.points).toBe(150);
  });

  it('awards zero for an incorrect answer', () => {
    const result = service.scoreQuizAnswer({
      isCorrect: false,
      responseMs: 1_000,
      difficulty: 3,
    });

    expect(result.points).toBe(0);
  });

  it('applies a difficulty multiplier', () => {
    const result = service.scoreQuizAnswer({
      isCorrect: true,
      responseMs: 20_000,
      difficulty: 5,
      timeLimitMs: 20_000,
    });

    expect(result.difficultyMultiplier).toBe(2);
    expect(result.points).toBe(200);
    expect(result.combo).toBe(1);
    expect(result.comboMultiplier).toBe(1);
  });

  it('applies a combo multiplier on a live streak', () => {
    const result = service.scoreQuizAnswer({
      isCorrect: true,
      responseMs: 0,
      difficulty: 1,
      previousStreak: 2,
      timeLimitMs: 20_000,
    });

    expect(result.combo).toBe(3);
    expect(result.comboMultiplier).toBe(1.3);
    expect(result.points).toBe(195);
  });

  it('scores a precise map pin higher than a distant one', () => {
    const close = service.scoreMapGuess({
      distanceKm: 40,
      responseMs: 5_000,
      difficulty: 1,
      timeLimitMs: 30_000,
    });
    const far = service.scoreMapGuess({
      distanceKm: 4_000,
      responseMs: 5_000,
      difficulty: 1,
      timeLimitMs: 30_000,
    });

    expect(close.isCorrect).toBe(true);
    expect(close.basePoints).toBe(100);
    expect(far.isCorrect).toBe(false);
    expect(far.basePoints).toBe(10);
    expect(close.points).toBeGreaterThan(far.points);
  });
});
