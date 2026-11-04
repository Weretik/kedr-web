import 'server-only';

import { FALLBACK_COMPANY_REQUISITES } from '@site/core/config';
import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import {
  COMPANY_REQUISITES_CACHE_TAGS,
  COMPANY_REQUISITES_FAILURE_LIFE,
  COMPANY_REQUISITES_LIFE,
} from './company-requisites-cache';
import { mapCompanyRequisites } from './company-requisites.mapper';

import type { CompanyRequisites } from '@site/core/config';

/**
 * Payment requisites from the admin. When the API cannot be reached the last values in code are used,
 * so the requisites page always renders and the build never fails.
 */
export async function getCompanyRequisites(): Promise<CompanyRequisites> {
  'use cache';
  cacheTag(COMPANY_REQUISITES_CACHE_TAGS.all, COMPANY_REQUISITES_CACHE_TAGS.requisites);

  const result = await siteApiGet('/api/content/requisites');
  if (result.kind !== 'ok') {
    cacheLife(COMPANY_REQUISITES_FAILURE_LIFE);
    return FALLBACK_COMPANY_REQUISITES;
  }

  cacheLife(COMPANY_REQUISITES_LIFE);
  return mapCompanyRequisites(result.data);
}
