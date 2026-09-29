import { GameType } from '@world-challenge/shared';

export const GAME_META: Record<
  GameType,
  { tag: string; intensity: string; blurb: string }
> = {
  [GameType.COUNTRY_QUIZ]: {
    tag: 'Geography',
    intensity: 'Mixed',
    blurb: 'Capitals, flags, and the traps that catch tourists.',
  },
  [GameType.GUESS_WORD]: {
    tag: 'Language',
    intensity: 'Hard',
    blurb: 'Untranslatable words. The wrong answers are the usual myths.',
  },
  [GameType.MYSTERY_CUISINE]: {
    tag: 'Foodways',
    intensity: 'Hard',
    blurb: 'Ferments, techniques, and why the dish exists.',
  },
  [GameType.MUSIC]: {
    tag: 'Sound',
    intensity: 'Hard',
    blurb: 'Maqam, raga, instruments, and living performance codes.',
  },
  [GameType.WORLD_MAP]: {
    tag: 'Precision',
    intensity: 'Expert',
    blurb: 'Drop a pin. Distance is the score.',
  },
  [GameType.MIME]: {
    tag: 'Scene',
    intensity: 'Hard',
    blurb: 'Read the room. Name the cultural code being performed.',
  },
  [GameType.CULTURE_CODE]: {
    tag: 'Diplomacy',
    intensity: 'Expert',
    blurb: 'Etiquette that gets you invited back — or shown the door.',
  },
  [GameType.HISTORY_CLASH]: {
    tag: 'History',
    intensity: 'Expert',
    blurb: 'Turning points, treaties, and revolutions.',
  },
  [GameType.DUEL]: {
    tag: 'Live',
    intensity: 'Any',
    blurb: 'Same timer. Same questions. Winner by points.',
  },
};

export const CHALLENGE_GAME_TYPES = [
  GameType.CULTURE_CODE,
  GameType.HISTORY_CLASH,
  GameType.GUESS_WORD,
  GameType.MYSTERY_CUISINE,
  GameType.MUSIC,
  GameType.MIME,
  GameType.WORLD_MAP,
  GameType.COUNTRY_QUIZ,
] as const;
