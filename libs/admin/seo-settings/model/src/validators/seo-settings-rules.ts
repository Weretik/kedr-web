import type { SeoCodeField, SeoSettingsDraft } from '../entities/seo-settings';

const analyticsId = /^G-[A-Z0-9]{4,15}$/;
const tagManagerId = /^GTM-[A-Z0-9]{4,12}$/;
const verification = /^[A-Za-z0-9_-]{8,100}$/;
const metaContent = /content\s*=\s*["']([^"']*)["']/i;

/** Trimmed and upper-cased, as the backend stores ids. */
export const normalizeSeoId = (value: string) => value.trim().toUpperCase();

/** The code itself: from a pasted meta tag its `content` is taken, as on the backend. */
export function normalizeVerification(value: string): string {
  const text = value.trim();
  return metaContent.exec(text)?.[1]?.trim() ?? text;
}

const rules: Record<
  SeoCodeField,
  { normalize: (value: string) => string; valid: RegExp; message: string }
> = {
  googleAnalyticsId: {
    normalize: normalizeSeoId,
    valid: analyticsId,
    message: 'Ідентифікатор має вигляд G-AB12CD34EF.',
  },
  googleTagManagerId: {
    normalize: normalizeSeoId,
    valid: tagManagerId,
    message: 'Ідентифікатор має вигляд GTM-AB12CD3.',
  },
  googleSiteVerification: {
    normalize: normalizeVerification,
    valid: verification,
    message: 'Вставте код або весь мета-тег із Google Search Console.',
  },
  bingSiteVerification: {
    normalize: normalizeVerification,
    valid: verification,
    message: 'Вставте код або весь мета-тег із Bing Webmaster.',
  },
};

export const seoCodeFields = Object.keys(rules) as SeoCodeField[];

/** The value as it will be saved; null for an empty field. */
export function normalizeSeoCode(field: SeoCodeField, value: string): string | null {
  return rules[field].normalize(value) || null;
}

/** Field → message; every field may stay empty, a filled one must have the shape Google or Bing gives. */
export function seoSettingsIssues(draft: SeoSettingsDraft): Partial<Record<SeoCodeField, string>> {
  const issues: Partial<Record<SeoCodeField, string>> = {};
  for (const field of seoCodeFields) {
    const value = normalizeSeoCode(field, draft[field]);
    if (value && !rules[field].valid.test(value)) issues[field] = rules[field].message;
  }
  return issues;
}
