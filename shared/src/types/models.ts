import type { GameMode, GameStatus, GameType, PassportStatus } from './enums';

export interface CountrySummary {
  id: string;
  iso2: string;
  iso3: string;
  name: string;
  officialName: string | null;
  capital: string | null;
  continent: string | null;
  region: string | null;
  flagEmoji: string | null;
  flagUrl: string | null;
}

export interface PublicUser {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  language: string;
  xp: number;
  level: number;
  isOnline: boolean;
  country: CountrySummary;
}

export interface MeUser extends PublicUser {
  email: string;
  dateOfBirth: string;
  isAdmin: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  lastLoginCountryIso2: string | null;
  signupCountryIso2: string | null;
}

export interface GeoLocation {
  ip: string;
  country: CountrySummary | null;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  source: 'ip';
  isApproximate: boolean;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  user: MeUser;
}

export interface PassportCountryEntry {
  country: CountrySummary;
  status: PassportStatus;
  isHome: boolean;
  gamesPlayed: number;
  bestScore: number;
  discoveredAt: string | null;
  completedAt: string | null;
}

export interface PassportView {
  unlockedCount: number;
  totalCount: number;
  homeCountry: CountrySummary;
  countries: PassportCountryEntry[];
}

export interface GameCatalogItem {
  id: string;
  type: GameType;
  name: string;
  description: string | null;
  isActive: boolean;
}

export interface GamePlayerView {
  userId: string;
  username: string;
  avatarUrl: string | null;
  countryName: string;
  countryFlag: string | null;
  score: number;
  ready: boolean;
  xpAwarded: number;
}

export interface PublicQuestion {
  questionId: string;
  prompt: string;
  options: string[];
  imageUrl: string | null;
  round: number;
  totalRounds: number;
  timeLimitMs: number;
  endsAt: string;
}

export interface GameSessionView {
  id: string;
  gameType: GameType;
  gameName: string;
  status: GameStatus;
  mode: GameMode;
  maxPlayers: number;
  currentRound: number;
  totalRounds: number;
  hostUserId: string;
  invitedUserId: string | null;
  players: GamePlayerView[];
  currentQuestion: PublicQuestion | null;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface GameResultsView {
  sessionId: string;
  status: GameStatus;
  mode: GameMode;
  players: Array<GamePlayerView & { correctAnswers: number }>;
  winnerUserId: string | null;
  unlockedCountries: Array<{ userId: string; country: CountrySummary }>;
}

export interface DiscoverUsersPage {
  items: PublicUser[];
  total: number;
}
