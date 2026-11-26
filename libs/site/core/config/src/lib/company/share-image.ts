import { COMPANY } from './company';

/**
 * The site's own preview for links to pages without their own picture (1200×630, in `apps/site/public`). The admin
 * «Налаштування SEO сайту» may choose another one; see `@site/shared/seo-settings`.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/assets/og/kedr-og.jpg',
  width: 1200,
  height: 630,
  alt: COMPANY.name,
} as const;
