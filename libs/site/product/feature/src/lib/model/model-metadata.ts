import { selectModelProduct } from '@site/product/model';
import { buildProductMetadata } from '@site/product/seo';

import { loadAcceptedModel } from './model-response';
import { modelSeoInput } from './model-seo';
import { loadProductOrRespond } from '../routing/product-response';
import { getProductMetadata } from '../routing/product-routing';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

/** Canonical model metadata from the default variant; the query of a choice never changes it. */
export async function getModelMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const model = await loadAcceptedModel(locale, slug);
  if (!model) return getProductMetadata(locale, slug);
  const product = await loadProductOrRespond(locale, selectModelProduct(model, {})!.slug);
  return buildProductMetadata(modelSeoInput(locale, model, product));
}
