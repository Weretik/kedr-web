import { isValidProductSlug } from '@site/product/model';

import type { ApiCatalogRedirect } from './product.dto';

/** Only the declared category redirect with a safe provider-owned segment is accepted. */
export function categoryRedirectSlug(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null;
  const redirect = body as Partial<ApiCatalogRedirect>;
  return redirect.redirectType === 'category' && isValidProductSlug(redirect.redirectSlug)
    ? redirect.redirectSlug
    : null;
}
