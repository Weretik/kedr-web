import { useLocalDatabase, useLocalDataVersion, useLocalQuery } from '@mobile/core/local-db';
import { useMemo } from 'react';

import { cachedPricedProducts } from '../queries/catalog-cache';
import { readCategories, readCustomerPricing, readPricedProduct } from '../queries/catalog-queries';

import type { Category, PricedProduct } from '@mobile/catalog/model';

export function useCategories(): Category[] {
  return useLocalQuery(['catalog'], readCategories);
}

/** Every product with the customer's price in name order; prices stay null without a customer. */
export function usePricedProducts(counterpartyId: string | null): PricedProduct[] {
  const db = useLocalDatabase();
  const catalogVersion = useLocalDataVersion('catalog');
  const customersVersion = useLocalDataVersion('customers');
  return useMemo(
    () => cachedPricedProducts(db, { catalogVersion, customersVersion }, counterpartyId),
    [db, counterpartyId, catalogVersion, customersVersion],
  );
}

export function usePricedProduct(
  productId: number,
  counterpartyId: string | null,
): PricedProduct | null {
  return useLocalQuery(['catalog', 'customers'], (db) =>
    readPricedProduct(
      db,
      productId,
      counterpartyId ? readCustomerPricing(db, counterpartyId) : null,
    ),
  );
}
