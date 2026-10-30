import { cacheLife } from 'next/cache';

// Cached so the footer stays in the prerendered shell; the year refreshes within a day.
export async function CopyrightYear() {
  'use cache';
  cacheLife('days');
  return <>{new Date().getFullYear()}</>;
}
