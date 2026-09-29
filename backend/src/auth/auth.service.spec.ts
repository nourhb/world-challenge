import { isAtLeast18 } from './auth.service';

describe('isAtLeast18', () => {
  const now = new Date('2026-09-28T00:00:00.000Z');

  it('accepts an 18th birthday that has already happened', () => {
    expect(isAtLeast18(new Date('2008-09-28T00:00:00.000Z'), now)).toBe(true);
  });

  it('rejects a 17-year-old', () => {
    expect(isAtLeast18(new Date('2008-09-29T00:00:00.000Z'), now)).toBe(false);
  });
});
