import 'server-only';

import { FALLBACK_COMPANY_CONTACTS } from '@site/core/config';
import { siteApiGet } from '@site/shared/api-client';
import { cacheLife, cacheTag } from 'next/cache';

import {
  COMPANY_CONTACTS_CACHE_TAGS,
  COMPANY_CONTACTS_FAILURE_LIFE,
  COMPANY_CONTACTS_LIFE,
} from './company-contacts-cache';
import { mapCompanyContacts } from './company-contacts.mapper';

import type { CompanyContacts } from '@site/core/config';

/**
 * Sales contacts from the admin. When the API cannot be reached the last values in code are used,
 * so the header, footer, and pages always show a phone and the build never fails.
 */
export async function getCompanyContacts(): Promise<CompanyContacts> {
  'use cache';
  cacheTag(COMPANY_CONTACTS_CACHE_TAGS.all, COMPANY_CONTACTS_CACHE_TAGS.contacts);

  const result = await siteApiGet('/api/content/contacts');
  if (result.kind !== 'ok') {
    cacheLife(COMPANY_CONTACTS_FAILURE_LIFE);
    return FALLBACK_COMPANY_CONTACTS;
  }

  cacheLife(COMPANY_CONTACTS_LIFE);
  return mapCompanyContacts(result.data);
}
