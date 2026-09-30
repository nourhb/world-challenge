import { describe, expect, it } from 'vitest';
import { levelFromTotalXp, rankTitle, xpRequiredForLevel } from './progression';

describe('xpRequiredForLevel', () => {
  it('uses 100 × N²', () => {
    expect(xpRequiredForLevel(1)).toBe(100);
    expect(xpRequiredForLevel(2)).toBe(400);
    expect(xpRequiredForLevel(3)).toBe(900);
    expect(xpRequiredForLevel(4)).toBe(1600);
  });

  it('rejects invalid levels', () => {
    expect(() => xpRequiredForLevel(0)).toThrow();
    expect(() => xpRequiredForLevel(1.5)).toThrow();
  });
});

describe('levelFromTotalXp', () => {
  it('starts players at level 1', () => {
    expect(levelFromTotalXp(0)).toBe(1);
    expect(levelFromTotalXp(99)).toBe(1);
  });

  it('advances when the next threshold is reached', () => {
    expect(levelFromTotalXp(400)).toBe(2);
    expect(levelFromTotalXp(899)).toBe(2);
    expect(levelFromTotalXp(900)).toBe(3);
  });
});

describe('rankTitle', () => {
  it('maps level bands onto diplomatic ranks', () => {
    expect(rankTitle(1)).toBe('Recruit');
    expect(rankTitle(3)).toBe('Courier');
    expect(rankTitle(7)).toBe('Diplomat');
    expect(rankTitle(15)).toBe('Ambassador');
  });
});
