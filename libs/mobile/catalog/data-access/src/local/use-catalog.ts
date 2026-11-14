import { useLocalAsyncQuery, useLocalDataVersion, useLocalQuery } from '@mobile/core/local-db';

import {
  priceCatalog,
  readCatalogBase,
  readCategories,
  readCustomerPricing,
  readLineProducts,
  readPricedProduct,
  type CatalogBase,
} from './catalog-queries';

import type { Category, PricedProduct } from '@mobile/catalog/model';
import type { LocalReader } from '@mobile/core/local-db';

export function useCategories(): Category[] | undefined {
  return useLocalAsyncQuery(['catalog'], ['categories'], readCategories);
}

// Products are read once per catalog version and shared by every customer's prices.
let base: { promise: Promise<CatalogBase>; reader: LocalReader; version: number } | null = null;

function catalogBase(reader: LocalReader, version: number): Promise<CatalogBase> {
  if (base?.reader !== reader || base.version !== version) {
    base = { promise: readCatalogBase(reader), reader, version };
  }
  return base.promise;
}

/**
 * Every product with the customer's price in name order, read off the screen's thread; prices stay null without a
 * customer. Undefined only until the first read.
 */
export function usePricedProducts(counterpartyId: string | null): PricedProduct[] | undefined {
  const catalogVersion = useLocalDataVersion('catalog');
  return useLocalAsyncQuery(
    ['catalog', 'customers'],
    ['priced-products', counterpartyId],
    async (reader) =>
      priceCatalog(
        reader,
        await catalogBase(reader, catalogVersion),
        counterpartyId ? await readCustomerPricing(reader, counterpartyId) : null,
      ),
  );
}

/** One product with the customer's price; undefined while it is read, null when the catalog has no such product. */
export function usePricedProduct(
  productId: number,
  counterpartyId: string | null,
): PricedProduct | null | undefined {
  return useLocalAsyncQuery(
    ['catalog', 'customers'],
    ['priced-product', productId, counterpartyId],
    async (reader) =>
      readPricedProduct(
        reader,
        productId,
        counterpartyId ? await readCustomerPricing(reader, counterpartyId) : null,
      ),
  );
}

/** The products of the open calculation with the customer's price, by id. */
export function useLineProducts(
  productIds: readonly number[],
  counterpartyId: string,
): Map<number, PricedProduct> {
  return useLocalQuery(['catalog', 'customers'], (db) =>
    readLineProducts(db, productIds, counterpartyId),
  );
}
