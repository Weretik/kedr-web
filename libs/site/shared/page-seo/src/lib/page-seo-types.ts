import type { components } from '@shared/api-contracts';

/** The site pages that exist once and whose search texts editors may set. */
export type SitePage = components['schemas']['SitePage'];

/** What an editor set; null keeps the page's own text. */
export type PageSeoText = { title: string | null; description: string | null };
