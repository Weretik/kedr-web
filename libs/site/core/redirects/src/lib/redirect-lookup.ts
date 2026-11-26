/** One stored redirect as `GET /api/content/redirects` returns it (spec content/013). */
export interface SiteRedirectEntry {
  from: string;
  to: string;
}

/** Lookup key of the old address → the new address (a site path with its query, or a full URL). */
export type SiteRedirectMap = ReadonlyMap<string, string>;

export const EMPTY_REDIRECTS: SiteRedirectMap = new Map();

const decode = (path: string): string => {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
};

/**
 * The key the backend stores for an old address: decoded, lower case, without the query and the
 * trailing slash, so `/UK/Old/?a=1` and `/uk/old` find the same row.
 */
export function redirectLookupKey(pathname: string): string {
  const path = decode(pathname.split(/[?#]/, 1)[0] ?? '').toLowerCase();
  const trimmed = path.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

const isEntry = (value: unknown): value is SiteRedirectEntry =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as SiteRedirectEntry).from === 'string' &&
  typeof (value as SiteRedirectEntry).to === 'string';

/** Builds the lookup map from the API answer; malformed rows are skipped, a malformed answer throws. */
export function toRedirectMap(value: unknown): SiteRedirectMap {
  if (!Array.isArray(value)) throw new Error('Redirect list is not an array');
  return new Map(
    value.filter(isEntry).map((entry) => [redirectLookupKey(entry.from), entry.to] as const),
  );
}

/**
 * Where a request must go, or null. A redirect that would lead back to the same address is ignored,
 * so a bad row can never loop.
 */
export function redirectTarget(
  redirects: SiteRedirectMap,
  pathname: string,
  requestUrl: string,
): URL | null {
  const to = redirects.get(redirectLookupKey(pathname));
  if (!to) return null;
  const target = new URL(to, requestUrl);
  const sameSite = target.origin === new URL(requestUrl).origin;
  return sameSite && redirectLookupKey(target.pathname) === redirectLookupKey(pathname)
    ? null
    : target;
}
