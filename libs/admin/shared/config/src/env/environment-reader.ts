/// <reference types="vite/client" />

import type { AdminEnvironment } from './admin-environment.types';

export function readEnvironment(): AdminEnvironment {
  return import.meta.env;
}

export function readBoolean(value: string | undefined, fallback: boolean): boolean {
  return value === undefined ? fallback : value === 'true';
}

export function readString(value: string | undefined, fallback: string): string {
  return value || fallback;
}
