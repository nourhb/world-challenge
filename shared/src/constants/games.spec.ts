import { describe, expect, it } from 'vitest';
import {
  comboMultiplier,
  currentCombo,
  dailyChallengeType,
  difficultyLabel,
  peakCombo,
  PLAYABLE_GAME_TYPES,
} from './games';

describe('combo scoring', () => {
  it('keeps a single hit at 1x and ramps a long streak', () => {
    expect(comboMultiplier(1)).toBe(1);
    expect(comboMultiplier(3)).toBe(1.3);
    expect(comboMultiplier(8)).toBe(1.75);
  });

  it('reads the live streak from the tail of the round', () => {
    expect(currentCombo([true, true, false, true, true])).toBe(2);
    expect(currentCombo([true, true, true])).toBe(3);
    expect(currentCombo([true, false])).toBe(0);
  });

  it('tracks the best streak in a match', () => {
    expect(peakCombo([true, true, false, true, true, true])).toBe(3);
  });
});

describe('dailyChallengeType', () => {
  it('is stable for a UTC day and stays inside the live catalog', () => {
    const a = dailyChallengeType(new Date('2026-09-30T01:00:00.000Z'));
    const b = dailyChallengeType(new Date('2026-09-30T23:00:00.000Z'));
    expect(a).toBe(b);
    expect(PLAYABLE_GAME_TYPES).toContain(a);
  });
});

describe('difficultyLabel', () => {
  it('labels 4+ as expert', () => {
    expect(difficultyLabel(2)).toBe('Standard');
    expect(difficultyLabel(3)).toBe('Advanced');
    expect(difficultyLabel(5)).toBe('Expert');
  });
});
