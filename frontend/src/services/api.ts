import type {
  ApiResponse,
  AuthTokens,
  CountrySummary,
  DiscoverUsersPage,
  GameCatalogItem,
  GameMode,
  GameResultsView,
  GameSessionView,
  GameType,
  GeoLocation,
  HealthStatus,
  MeUser,
  PassportView,
  PublicUser,
} from '@world-challenge/shared';
import { useAuthStore } from '../features/auth/auth-store';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
  }
}

let refreshInFlight: Promise<string | null> | null = null;

async function parsePayload<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new ApiRequestError(
      payload.error.message,
      response.status,
      payload.error.code,
    );
  }
  return payload.data;
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshInFlight) {
    refreshInFlight = (async () => {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        useAuthStore.getState().clear();
        return null;
      }
      const tokens = await parsePayload<AuthTokens>(response);
      useAuthStore.getState().setSession(tokens.accessToken, tokens.user);
      return tokens.accessToken;
    })().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (response.status === 401 && retry && path !== '/auth/refresh') {
    const nextToken = await refreshAccessToken();
    if (nextToken) {
      return request<T>(path, init, false);
    }
  }

  return parsePayload<T>(response);
}

export function bootstrapSession(): Promise<string | null> {
  return refreshAccessToken();
}

export function getHealth(): Promise<HealthStatus> {
  return request<HealthStatus>('/health');
}

export function getCountries(): Promise<CountrySummary[]> {
  return request<CountrySummary[]>('/countries');
}

export function getGeoLocation(): Promise<GeoLocation> {
  return request<GeoLocation>('/auth/location');
}

export function registerAccount(body: {
  username: string;
  email: string;
  password: string;
  countryId: string;
  dateOfBirth: string;
  termsAccepted: boolean;
}): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function loginAccount(body: {
  identifier: string;
  password: string;
}): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function logoutAccount(): Promise<{ loggedOut: true }> {
  return request<{ loggedOut: true }>('/auth/logout', { method: 'POST' });
}

export function getMe(): Promise<MeUser> {
  return request<MeUser>('/users/me');
}

export function updateMe(body: {
  bio?: string;
  avatarUrl?: string;
  language?: string;
}): Promise<MeUser> {
  return request<MeUser>('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

export function getDiscoverUsers(search?: string): Promise<DiscoverUsersPage> {
  const query = search ? `?search=${encodeURIComponent(search)}` : '';
  return request<DiscoverUsersPage>(`/users${query}`);
}

export function getPublicUser(id: string): Promise<PublicUser> {
  return request<PublicUser>(`/users/${id}`);
}

export function getPassport(): Promise<PassportView> {
  return request<PassportView>('/users/me/passport');
}

export function getGames(): Promise<GameCatalogItem[]> {
  return request<GameCatalogItem[]>('/games');
}

export function getMySessions(): Promise<GameSessionView[]> {
  return request<GameSessionView[]>('/games/sessions/mine');
}

export function createSession(body: {
  gameType: GameType;
  mode: GameMode;
  invitedUserId?: string;
}): Promise<GameSessionView> {
  return request<GameSessionView>('/games/sessions', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function getSession(id: string): Promise<GameSessionView> {
  return request<GameSessionView>(`/games/sessions/${id}`);
}

export function joinSession(id: string): Promise<GameSessionView> {
  return request<GameSessionView>(`/games/sessions/${id}/join`, {
    method: 'POST',
  });
}

export function getSessionResults(id: string): Promise<GameResultsView> {
  return request<GameResultsView>(`/games/sessions/${id}/results`);
}

export { ApiRequestError };
