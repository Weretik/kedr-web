import { isSitePage, sitePages } from '@admin/page-seo/model';

import { adminPageSeoListSchema, adminPageSeoSchema } from '../validators/page-seo.schemas';

import type { SavePageSeoBody } from '../contracts/admin-page-seo.contract';
import type { PageSeoEntry, PageSeoTexts } from '@admin/page-seo/model';
import type { z } from 'zod';

type Row = z.infer<typeof adminPageSeoSchema>;

/** One saved page; a page the admin does not know is left out. */
export function mapPageSeoEntry(value: unknown): PageSeoEntry {
  const entry = toEntry(adminPageSeoSchema.parse(value));
  if (!entry) throw new Error('Unknown site page in the response');
  return entry;
}

/** The pages in the site menu order the admin knows. */
export function mapPageSeoList(value: unknown): PageSeoEntry[] {
  const rows = adminPageSeoListSchema.parse(value);
  const byPage = new Map(rows.map((row) => [row.page, row]));
  return sitePages.flatMap((site) => {
    const row = byPage.get(site.page);
    const entry = row ? toEntry(row) : undefined;
    return entry ? [entry] : [];
  });
}

/** Trimmed texts; an empty one is sent as null so the site keeps its own. */
export const toSavePageSeoBody = (texts: PageSeoTexts): SavePageSeoBody => ({
  titleUk: texts.titleUk.trim() || null,
  titleRu: texts.titleRu.trim() || null,
  descriptionUk: texts.descriptionUk.trim() || null,
  descriptionRu: texts.descriptionRu.trim() || null,
});

function toEntry(row: Row): PageSeoEntry | undefined {
  if (!isSitePage(row.page)) return undefined;
  const site = sitePages.find((entry) => entry.page === row.page);
  if (!site) return undefined;
  return {
    page: site.page,
    label: site.label,
    path: site.path,
    texts: {
      titleUk: row.titleUk ?? '',
      titleRu: row.titleRu ?? '',
      descriptionUk: row.descriptionUk ?? '',
      descriptionRu: row.descriptionRu ?? '',
    },
    updatedAt: row.updatedAt,
    updatedBy: row.updatedBy,
  };
}
