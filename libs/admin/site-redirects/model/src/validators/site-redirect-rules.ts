import { siteRedirectFromMaxLength, siteRedirectToMaxLength } from '../entities/site-redirect';

import type { SiteRedirectDraft } from '../entities/site-redirect';

type Issues = Partial<Record<keyof SiteRedirectDraft, string>>;

const fullUrl = /^https?:\/\/\S+$/i;
const sitePath = /^\/(?!\/)\S*$/;
const reservedPaths = new Set(['/', '/uk', '/ru', '/api', '/_next']);

/**
 * The old path as the site looks it up (spec content/013 R-02): a full URL gives its path, the query and fragment
 * are dropped, the rest is decoded, lower case, without a trailing slash. `undefined` when it is not an address.
 */
export function siteRedirectLookupPath(value: string): string | undefined {
  const text = value.trim();
  let path = text;
  if (fullUrl.test(text)) {
    try {
      path = new URL(text).pathname;
    } catch {
      return undefined;
    }
  }
  if (!sitePath.test(path)) return undefined;
  const bare = path.split(/[?#]/)[0] ?? '';
  let decoded = bare;
  try {
    decoded = decodeURIComponent(bare);
  } catch {
    // A stray % stays as typed; the server decides.
  }
  const trimmed = decoded.toLowerCase().replace(/\/+$/, '');
  return trimmed || '/';
}

/** Field → message, the same rules the server checks; the server stays the judge of duplicates and chains. */
export function siteRedirectIssues(draft: SiteRedirectDraft): Issues {
  const issues: Issues = {};
  const from = siteRedirectLookupPath(draft.from);
  const to = draft.to.trim();

  if (!draft.from.trim()) issues.from = 'Вкажіть стару адресу.';
  else if (!from) issues.from = 'Адреса має починатися з «/» або з https://, без пробілів.';
  else if (from.length > siteRedirectFromMaxLength)
    issues.from = `Не більше ${siteRedirectFromMaxLength} символів.`;
  else if (reservedPaths.has(from) || from.startsWith('/api/') || from.startsWith('/_next/'))
    issues.from = 'Головну сторінку, /api/ і /_next/ переадресувати не можна.';

  if (!to) issues.to = 'Вкажіть нову адресу.';
  else if (to.length > siteRedirectToMaxLength)
    issues.to = `Не більше ${siteRedirectToMaxLength} символів.`;
  else if (!fullUrl.test(to) && !sitePath.test(to))
    issues.to = 'Адреса має починатися з «/» або з https://, без пробілів.';
  else if (from && !fullUrl.test(to) && siteRedirectLookupPath(to) === from)
    issues.to = 'Нова адреса збігається зі старою.';

  return issues;
}
