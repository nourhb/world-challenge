export const GAME_TYPES = [
  'COUNTRY_QUIZ',
  'GUESS_WORD',
  'MYSTERY_CUISINE',
  'MUSIC',
  'WORLD_MAP',
  'MIME',
  'DUEL',
  'CULTURE_CODE',
  'HISTORY_CLASH',
] as const;

export const PLAYABLE_GAME_TYPES = [
  'COUNTRY_QUIZ',
  'GUESS_WORD',
  'MYSTERY_CUISINE',
  'MUSIC',
  'WORLD_MAP',
  'MIME',
  'CULTURE_CODE',
  'HISTORY_CLASH',
] as const;

export const MVP_GAME_TYPES = [
  'COUNTRY_QUIZ',
  'GUESS_WORD',
  'WORLD_MAP',
  'DUEL',
] as const;

export const MAP_DISTANCE_SCORES = {
  under100km: 100,
  from100To500km: 80,
  from500To1500km: 60,
  from1500To3000km: 40,
  over3000km: 10,
} as const;

export const QUIZ_ROUND_COUNT = 5;
export const QUIZ_TIME_LIMIT_MS = 20_000;
export const MAP_TIME_LIMIT_MS = 30_000;
export const QUIZ_COUNTDOWN_MS = 3_000;
export const QUIZ_BASE_POINTS = 100;
export const QUIZ_MAX_SPEED_BONUS = 50;
export const MAP_CORRECT_WITHIN_KM = 500;

export const COMBO_MULTIPLIERS = {
  1: 1,
  2: 1.15,
  3: 1.3,
  4: 1.5,
  5: 1.75,
} as const;

export function isPlayableGameType(gameType: string): boolean {
  return (PLAYABLE_GAME_TYPES as readonly string[]).includes(gameType);
}

export function comboMultiplier(combo: number): number {
  if (combo <= 0) {
    return 1;
  }
  if (combo >= 5) {
    return COMBO_MULTIPLIERS[5];
  }
  return COMBO_MULTIPLIERS[combo as 1 | 2 | 3 | 4] ?? 1;
}

export function currentCombo(hits: readonly boolean[]): number {
  let streak = 0;
  for (let index = hits.length - 1; index >= 0; index -= 1) {
    if (!hits[index]) {
      break;
    }
    streak += 1;
  }
  return streak;
}

export function peakCombo(hits: readonly boolean[]): number {
  let peak = 0;
  let streak = 0;
  for (const hit of hits) {
    streak = hit ? streak + 1 : 0;
    peak = Math.max(peak, streak);
  }
  return peak;
}

export function dailyChallengeType(
  now = new Date(),
): (typeof PLAYABLE_GAME_TYPES)[number] {
  const day = now.toISOString().slice(0, 10);
  let hash = 0;
  for (let index = 0; index < day.length; index += 1) {
    hash = (hash * 33 + day.charCodeAt(index)) >>> 0;
  }
  const picked = PLAYABLE_GAME_TYPES[hash % PLAYABLE_GAME_TYPES.length];
  return picked ?? 'CULTURE_CODE';
}

export function difficultyLabel(difficulty: number): string {
  if (difficulty >= 4) {
    return 'Expert';
  }
  if (difficulty >= 3) {
    return 'Advanced';
  }
  return 'Standard';
}

