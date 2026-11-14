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
  reason?: string;
  status?: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
  traceId?: string;
  conflict?: unknown;
}

/** The browser session lives in an HttpOnly cookie; the client only reacts when it ends. */
export interface AuthSessionAdapter {
  onUnauthenticated?: () => void | Promise<void>;
}

export type ApiErrorNotifier = (error: unknown) => void;

export interface ApiClientOptions {
  authSession?: AuthSessionAdapter;
}
