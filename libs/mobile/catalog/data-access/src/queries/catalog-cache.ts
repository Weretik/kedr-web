import { type PricedProduct } from '@mobile/catalog/model';
import { type LocalDatabase } from '@mobile/core/local-db';

import {
  priceCatalog,
  readCatalogBase,
  readCustomerPricing,
  type CatalogBase,
} from './catalog-queries';

export interface CatalogVersions {
  catalogVersion: number;
  /** Customer price rules live with the customers. */
  customersVersion: number;
}

interface CacheEntry {
  base: CatalogBase;
  catalogVersion: number;
  customersVersion: number;
  db: LocalDatabase;
  /** Counterparty id ('' without a customer) → the priced list. */
  priced: Map<string, PricedProduct[]>;
}

let entry: CacheEntry | null = null;
const maxPricedLists = 4;

/**
 * The priced catalog, shared by the catalog and the calculation: products are read once per catalog sync, prices
 * once per customer until the catalog or the customers change.
 */
export function cachedPricedProducts(
  db: LocalDatabase,
  { catalogVersion, customersVersion }: CatalogVersions,
  counterpartyId: string | null,
): PricedProduct[] {
  if (entry?.db !== db || entry.catalogVersion !== catalogVersion) {
    entry = { base: readCatalogBase(db), catalogVersion, customersVersion, db, priced: new Map() };
  } else if (entry.customersVersion !== customersVersion) {
    entry = { ...entry, customersVersion, priced: new Map() };
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
