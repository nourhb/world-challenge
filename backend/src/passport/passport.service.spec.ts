import { PassportStatus } from '@world-challenge/shared';
import { PassportService } from './passport.service';

describe('PassportService.unlockOpponentCountry', () => {
  it('does not unlock the player own country', async () => {
    const tx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          countryId: 'tn',
          country: { id: 'tn' },
        }),
      },
      country: { findUnique: jest.fn() },
      userCountry: { findUnique: jest.fn(), upsert: jest.fn() },
    };
    const service = new PassportService({} as never);
    const result = await service.unlockOpponentCountry(
      tx as never,
      'user-1',
      'tn',
      200,
    );

    expect(result).toBeNull();
    expect(tx.userCountry.upsert).not.toHaveBeenCalled();
  });

  it('creates a completed stamp for the opponent country', async () => {
    const country = {
      id: 'jp',
      iso2: 'JP',
      iso3: 'JPN',
      name: 'Japan',
      officialName: 'Japan',
      capital: 'Tokyo',
      continent: 'Asia',
      region: 'Eastern Asia',
      flagEmoji: '🇯🇵',
      flagUrl: null,
    };
    const tx = {
      user: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'user-1',
          countryId: 'tn',
          country: { id: 'tn' },
        }),
      },
      country: { findUnique: jest.fn().mockResolvedValue(country) },
      userCountry: {
        findUnique: jest.fn().mockResolvedValue(null),
        upsert: jest.fn().mockResolvedValue({}),
      },
    };
    const service = new PassportService({} as never);
    const result = await service.unlockOpponentCountry(
      tx as never,
      'user-1',
      'jp',
      320,
    );

    expect(result?.name).toBe('Japan');
    expect(tx.userCountry.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          status: PassportStatus.COMPLETED,
          gamesPlayed: 1,
          bestScore: 320,
        }),
      }),
    );
  });
});
