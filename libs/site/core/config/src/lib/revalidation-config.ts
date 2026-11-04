type SiteEnv = Partial<Record<string, string | undefined>>;

export type RevalidationConfig = {
  /** Shared with KedrStore (`SiteRevalidation:Secret`); null turns `/api/revalidate` off. Server-only value. */
  secret: string | null;
};

/** Reads the cache refresh secret; the only place that knows its environment variable name. */
export function createRevalidationConfig(env: SiteEnv): RevalidationConfig {
  return { secret: env['KEDR_REVALIDATE_SECRET']?.trim() || null };
}
