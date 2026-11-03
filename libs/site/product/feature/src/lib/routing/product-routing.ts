import { LOCALES } from '@site/core/i18n';
import { getProductDetails, getProductPrerenderCandidates } from '@site/product/data-access';
import { buildProductMetadata } from '@site/product/seo';

import { getProductLanguagePaths } from './product-language-paths';
import { loadProductOrRespond } from './product-response';
import { productCrumbs } from '../detail/product-crumbs';
import { productSeoInput } from '../mapping/product-seo-input';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

export async function getProductMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const product = await loadProductOrRespond(locale, slug);
  const languagePaths = await getProductLanguagePaths(locale, product);
  return buildProductMetadata(
    productSeoInput(locale, product, productCrumbs(locale, product), languagePaths),
  );
}

/** A small real seed set; never walk the whole catalog or invent a placeholder. */
export async function getProductStaticParams(): Promise<Array<{ locale: Locale; slug: string }>> {
  const groups = await Promise.all(
    LOCALES.map(async (locale) => {
      const candidates = await getProductPrerenderCandidates(locale);
      if (candidates.kind !== 'ok') return [];
      for (const item of candidates.items.slice(0, 5)) {
        const result = await getProductDetails(locale, item.slug);
        if ((result.kind === 'ok' || result.kind === 'moved') && result.product.sku === item.sku) {
          return [{ locale, slug: result.product.slug }];
        }
      }
      return [];
    }),
  );
  const params = groups.flat();
  if (!params.length)
    throw new Error('Cannot prepare a real product prerender seed; catalog API must be available');
  return params;
}
