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

export function isPlayableGameType(gameType: string): boolean {
  return (PLAYABLE_GAME_TYPES as readonly string[]).includes(gameType);
}

