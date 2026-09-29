export interface ApiSuccess<T> {
  success: true;
  data: T;
  message: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details: unknown[];
}

export interface ApiError {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface HealthStatus {
  status: 'ok' | 'degraded';
  service: string;
  version: string;
  database: 'connected' | 'disconnected';
  countriesSeeded: number;
  timestamp: string;
}
