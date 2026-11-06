import { localizedPath } from '@site/core/i18n';
import { getSiteModel } from '@site/product/data-access';
import { isValidProductSlug, modelSelectionQuery, productPath } from '@site/product/model';
import { notFound, permanentRedirect } from 'next/navigation';

import type { Locale } from '@site/core/i18n';
import type { SiteModel } from '@site/product/model';

/**
 * An accepted model, or null for the product page (a product shown as a model of its own, an unknown slug, or an
 * unavailable model API: the product page then answers itself). A product inside an accepted model and a former
 * model slug answer 308 with the model address (spec site/product/002 D-01).
 */
export async function loadAcceptedModel(locale: Locale, slug: string): Promise<SiteModel | null> {
  if (!isValidProductSlug(slug)) notFound();
  const result = await getSiteModel(locale, slug);
  if (result.kind === 'moved' && result.modelSlug !== slug) {
    permanentRedirect(
      localizedPath(locale, productPath(result.modelSlug)) + modelSelectionQuery(result.selection),
    );
  }
  return result.kind === 'ok' && result.model.isAccepted ? result.model : null;
}
