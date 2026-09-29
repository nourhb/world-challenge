import { XP_REWARDS } from '@world-challenge/shared';
import { XpService } from './xp.service';

describe('XpService', () => {
  const service = new XpService();

  it('awards participation, correct-answer, and first-country bonuses', () => {
    expect(
      service.computeGameXp({
        correctAnswers: 3,
        discoveredNewCountry: true,
        firstGameWithCountry: true,
      }),
    ).toBe(
      XP_REWARDS.completeGame +
        3 * XP_REWARDS.correctAnswer +
        XP_REWARDS.discoverCountry +
        XP_REWARDS.firstGameWithCountry,
    );
  });

  it('does not invent country bonuses for solo play', () => {
    expect(
      service.computeGameXp({
        correctAnswers: 5,
        discoveredNewCountry: false,
        firstGameWithCountry: false,
      }),
    ).toBe(XP_REWARDS.completeGame + 5 * XP_REWARDS.correctAnswer);
  });
});
