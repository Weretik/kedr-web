import { categoryPath } from '@site/catalog/model';
import { localizedPath } from '@site/core/i18n';
import { getProductDetails } from '@site/product/data-access';
import { isValidProductSlug, productPath } from '@site/product/model';
import { notFound, permanentRedirect } from 'next/navigation';

import type { Locale } from '@site/core/i18n';

export async function loadProductOrRespond(locale: Locale, slug: string) {
  if (!isValidProductSlug(slug)) notFound();
  const result = await getProductDetails(locale, slug);
  if (result.kind === 'ok') return result.product;
  if (result.kind === 'moved' && result.slug !== slug) {
    permanentRedirect(localizedPath(locale, productPath(result.slug)));
  }
  if (result.kind === 'category-redirect') {
    permanentRedirect(localizedPath(locale, categoryPath(result.slug)));
  }
  if (result.kind === 'not-found') notFound();
  throw new Error('Product API unavailable');
}
