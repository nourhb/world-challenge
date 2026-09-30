/** XP required to reach level N: 100 × N² */
export function xpRequiredForLevel(level: number): number {
  if (!Number.isInteger(level) || level < 1) {
    throw new Error('Level must be an integer greater than or equal to 1');
  }

  return 100 * level * level;
}

export function levelFromTotalXp(totalXp: number): number {
  if (!Number.isFinite(totalXp) || totalXp < 0) {
    throw new Error('Total XP must be a non-negative number');
  }

  let level = 1;
  while (totalXp >= xpRequiredForLevel(level + 1)) {
    level += 1;
  }

  return level;
}

export const XP_REWARDS = {
  completeGame: 50,
  correctAnswer: 10,
  discoverCountry: 100,
  firstGameWithCountry: 50,
  badge: 100,
} as const;

export const RANK_LADDER = [
  { minLevel: 15, title: 'Ambassador' },
  { minLevel: 10, title: 'Consul' },
  { minLevel: 7, title: 'Diplomat' },
  { minLevel: 5, title: 'Envoy' },
  { minLevel: 3, title: 'Courier' },
  { minLevel: 1, title: 'Recruit' },
] as const;

export function rankTitle(level: number): string {
  const safe = Number.isFinite(level) ? Math.max(1, Math.floor(level)) : 1;
  const tier = RANK_LADDER.find((entry) => safe >= entry.minLevel);
  return tier?.title ?? 'Recruit';
}
