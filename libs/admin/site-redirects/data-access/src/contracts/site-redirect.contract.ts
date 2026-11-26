import type { components, operations } from '@shared/api-contracts';

export type SiteRedirectDto = components['schemas']['AdminSiteRedirectResponse'];
export type SaveSiteRedirectBody = components['schemas']['SaveSiteRedirectRequest'];
export type SiteRedirectListParams = NonNullable<
  operations['listAdminSiteRedirects']['parameters']['query']
>;
