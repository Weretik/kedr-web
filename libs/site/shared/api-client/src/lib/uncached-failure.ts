/**
 * Thrown inside a `'use cache'` read when the API did not answer. Next.js stores what the function returns, so a
 * returned "unavailable" would show the error page to every visitor for the whole failure lifetime; a thrown error
 * is never stored, and the next request reads the API again.
 */
export class SiteApiUnavailableError extends Error {
  constructor(path: string) {
    super(`Site API unavailable: ${path}`);
    this.name = 'SiteApiUnavailableError';
  }
}

/**
 * Runs a cached read that throws on failure and answers `unavailable` instead. Outside the cache the thrown error
 * has lost its class (Next.js passes it through the RSC stream), so every failure of the read counts.
 */
export async function readWithoutCachingFailure<T>(
  read: () => Promise<T>,
  unavailable: T,
): Promise<T> {
  try {
    return await read();
  } catch (error) {
    console.error('Site data read failed', {
      name: error instanceof Error ? error.name : typeof error,
      message: error instanceof Error ? error.message : String(error),
    });
    return unavailable;
  }
}
