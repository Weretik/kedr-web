/// <reference types="vite/client" />

/** Vite variables the Admin reads at build time. */
export interface AdminEnvironment {
  readonly DEV: boolean;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_APP_NAME?: string;
  readonly VITE_APP_VERSION?: string;
  readonly VITE_ENABLE_HTTP_LOGS?: string;
  readonly VITE_FEATURE_CATALOG?: string;
  readonly VITE_FEATURE_DASHBOARD?: string;
  readonly VITE_ROUTER_BASENAME?: string;
  readonly VITE_STOREFRONT_BASE_URL?: string;
}

export function readEnvironment(): AdminEnvironment {
  return import.meta.env;
}

export function readBoolean(value: string | undefined, fallback: boolean): boolean {
  return value === undefined ? fallback : value === 'true';
}

export function readString(value: string | undefined, fallback: string): string {
  return value || fallback;
}
