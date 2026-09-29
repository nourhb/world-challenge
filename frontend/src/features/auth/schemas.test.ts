import { describe, expect, it } from 'vitest';
import { isAdult } from './schemas';

describe('isAdult', () => {
  const now = new Date('2026-09-28T00:00:00.000Z');

  it('accepts an 18-year-old', () => {
    expect(isAdult('2008-09-28', now)).toBe(true);
  });

  it('rejects a 17-year-old', () => {
    expect(isAdult('2008-09-29', now)).toBe(false);
  });
});
