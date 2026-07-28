import { appConfig } from '@mobile/shared/config';

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

interface RequestMetadata {
  correlationId: string;
  startedAt: number;
}

type RequestConfigWithMetadata = InternalAxiosRequestConfig & { metadata?: RequestMetadata };

interface HttpLogEntry {
  durationMs: number;
  method: string;
  status?: number;
  url: string;
}

function createCorrelationId(): string {
  return `mobile-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function requestMetadata(config: RequestConfigWithMetadata): RequestMetadata {
  const metadata = {
    correlationId: createCorrelationId(),
    startedAt: Date.now(),
  };

  config.metadata = metadata;
  return metadata;
}

export function sanitizeUrl(url: string | undefined, baseUrl?: string): string {
  if (!url) {
    return '/';
  }

  try {
    const parsedUrl = new URL(url, baseUrl);
    return `${parsedUrl.origin}${parsedUrl.pathname}`;
  } catch {
    return url.split(/[?#]/, 1)[0];
  }
}

export function toHttpLogEntry(config: RequestConfigWithMetadata, status?: number): HttpLogEntry {
  return {
    durationMs: Math.max(0, Date.now() - (config.metadata?.startedAt ?? Date.now())),
    method: (config.method ?? 'get').toUpperCase(),
    status,
    url: sanitizeUrl(config.url, config.baseURL),
  };
}

export function installHttpLogging(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const metadata = requestMetadata(config);
    config.headers.set('X-Correlation-ID', metadata.correlationId);
    return config;
  });

  if (!appConfig.isDevelopment || !appConfig.enableHttpLogs) {
    return;
  }

  client.interceptors.response.use(
    (response) => {
      console.info('[Mobile API]', toHttpLogEntry(response.config, response.status));
      return response;
    },
    (error: unknown) => {
      const axiosError = error as {
        config?: RequestConfigWithMetadata;
        response?: { status?: number };
      };

      if (axiosError.config) {
        console.info(
          '[Mobile API]',
          toHttpLogEntry(axiosError.config, axiosError.response?.status),
        );
      }

      return Promise.reject(error);
    },
  );
}
