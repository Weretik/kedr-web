import { siteRedirectPageSchema, siteRedirectSchema } from '../validators/site-redirect.schemas';

import type { SaveSiteRedirectBody } from '../contracts/site-redirect.contract';
import type {
  SiteRedirect,
  SiteRedirectDraft,
  SiteRedirectPage,
} from '@admin/site-redirects/model';

export const mapSiteRedirect = (value: unknown): SiteRedirect => siteRedirectSchema.parse(value);

export function mapSiteRedirectPage(value: unknown): SiteRedirectPage {
  const page = siteRedirectPageSchema.parse(value);
  return { items: page.items, totalCount: page.totalCount };
}

/** Trimmed addresses; the server stores the old one as the site looks it up. */
export const toSaveSiteRedirectBody = (
  draft: SiteRedirectDraft,
  version?: number,
): SaveSiteRedirectBody => ({
  from: draft.from.trim(),
  to: draft.to.trim(),
  ...(version === undefined ? {} : { version }),
});
