import type { Metadata } from 'next';

/** Codes of the admin «Налаштування SEO сайту» that every page carries; empty ones are null. */
export type SiteCodes = {
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  googleSiteVerification: string | null;
  bingSiteVerification: string | null;
};

const ANALYTICS_ID = /^G-[A-Z0-9]{4,15}$/;
const TAG_MANAGER_ID = /^GTM-[A-Z0-9]{4,12}$/;
const VERIFICATION = /^[A-Za-z0-9_-]{8,100}$/;

/** The id when it has the shape Google gives; anything else never reaches a script. */
export const analyticsId = (value: string | null): string | null =>
  value && ANALYTICS_ID.test(value) ? value : null;

export const tagManagerId = (value: string | null): string | null =>
  value && TAG_MANAGER_ID.test(value) ? value : null;

/** `google-site-verification` and Bing `msvalidate.01` meta tags for the root layout; none when both are empty. */
export function buildVerificationMetadata(codes: SiteCodes): Metadata['verification'] {
  const google = codes.googleSiteVerification;
  const bing = codes.bingSiteVerification;
  const verification: NonNullable<Metadata['verification']> = {};
  if (google && VERIFICATION.test(google)) verification.google = google;
  if (bing && VERIFICATION.test(bing)) verification.other = { 'msvalidate.01': bing };
  return Object.keys(verification).length > 0 ? verification : undefined;
}
