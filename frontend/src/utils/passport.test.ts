import { describe, expect, it } from 'vitest';
import { formatPassportProgress } from './passport';

describe('formatPassportProgress', () => {
  it('formats unlocked country counts', () => {
    expect(formatPassportProgress(12, 195)).toBe('12 / 195 countries unlocked');
  });

  it('rejects invalid values', () => {
    expect(() => formatPassportProgress(-1, 195)).toThrow();
    expect(() => formatPassportProgress(12, 0)).toThrow();
  });
});
