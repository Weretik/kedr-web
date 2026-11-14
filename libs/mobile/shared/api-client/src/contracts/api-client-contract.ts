import type { AxiosRequestConfig } from 'axios';

export interface ApiRequest {
  data?: AxiosRequestConfig['data'];
  headers?: AxiosRequestConfig['headers'];
  method?: AxiosRequestConfig['method'];
  params?: AxiosRequestConfig['params'];
  url: string;
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
  fieldErrors?: Record<string, string[]>;
  message: string;
  status?: number;
  traceId?: string;
}
