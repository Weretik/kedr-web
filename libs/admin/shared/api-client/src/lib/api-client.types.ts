import type { AxiosRequestConfig } from 'axios';

export interface ApiRequest {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
}

export type ApiErrorCode =
  | 'Unknown'
  | 'Network'
  | 'Timeout'
  | 'Unauthorized'
  | 'Forbidden'
  | 'NotFound'
  | 'Validation'
  | 'Server';

export interface ApiError {
  code: ApiErrorCode;
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
}

export interface AuthSessionAdapter {
  getAccessToken: () => string | null | Promise<string | null>;
  refreshAccessToken?: () => Promise<string | null>;
  onUnauthenticated?: () => void | Promise<void>;
}

export type ApiErrorNotifier = (error: unknown) => void;

export interface ApiClientOptions {
  authSession?: AuthSessionAdapter;
}
