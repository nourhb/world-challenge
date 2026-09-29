import { normalizeAnswer } from './country-quiz.engine';

describe('normalizeAnswer', () => {
  it('compares answers case-insensitively', () => {
    expect(normalizeAnswer(' Japan ')).toBe(normalizeAnswer('japan'));
  });
});
