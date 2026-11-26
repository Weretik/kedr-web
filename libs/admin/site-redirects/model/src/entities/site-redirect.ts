/** One redirect of the public site: the old path answers with a permanent 301 to the new address. */
export interface SiteRedirect {
  id: number;
  /** Old path as the site matches it: decoded, lower case, without a trailing slash. */
  from: string;
  /** New address: a site path or a full http(s) URL. */
  to: string;
  updatedAt: string;
  updatedBy: string;
  /** Row version the next save sends back; a newer save answers 409. */
  version: number;
}

/** What the editor types in the panel. */
export interface SiteRedirectDraft {
  from: string;
  to: string;
}

export interface SiteRedirectPage {
  items: SiteRedirect[];
  totalCount: number;
}

/** Backend limits (spec content/013 R-02). */
export const siteRedirectFromMaxLength = 500;
export const siteRedirectToMaxLength = 1000;

export const emptySiteRedirectDraft: SiteRedirectDraft = { from: '', to: '' };
