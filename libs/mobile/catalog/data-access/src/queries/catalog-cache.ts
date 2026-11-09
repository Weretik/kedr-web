import { type PricedProduct } from '@mobile/catalog/model';
import { type LocalDatabase } from '@mobile/core/local-db';

import {
  priceCatalog,
  readCatalogBase,
  readCustomerPricing,
  type CatalogBase,
} from './catalog-queries';

interface CacheEntry {
  base: CatalogBase;
  db: LocalDatabase;
  /** Counterparty id ('' without a customer) → the priced list. */
  priced: Map<string, PricedProduct[]>;
  version: number;
}

let entry: CacheEntry | null = null;
const maxPricedLists = 4;

/**
 * The priced catalog of the local data version, shared by every screen: the catalog, the calculation and the photo
 * download read it once per version and customer instead of on every mount.
 */
export function cachedPricedProducts(
  db: LocalDatabase,
  version: number,
  counterpartyId: string | null,
): PricedProduct[] {
  if (entry?.db !== db || entry.version !== version) {
    entry = { base: readCatalogBase(db), db, priced: new Map(), version };
  }
  const key = counterpartyId ?? '';
  const known = entry.priced.get(key);
  if (known) return known;

  const pricing = counterpartyId ? readCustomerPricing(db, counterpartyId) : null;
  const priced = priceCatalog(db, entry.base, pricing);
  if (entry.priced.size >= maxPricedLists) entry.priced.clear();
  entry.priced.set(key, priced);
  return priced;
}
