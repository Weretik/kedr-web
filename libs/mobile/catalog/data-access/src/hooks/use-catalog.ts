import { useLocalDatabase, useLocalDataVersion } from '@mobile/core/local-db';
import { useMemo } from 'react';

import { cachedPricedProducts } from '../queries/catalog-cache';
import { readCategories, readCustomerPricing, readPricedProduct } from '../queries/catalog-queries';

import type { Category, PricedProduct } from '@mobile/catalog/model';

export function useCategories(): Category[] {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  return useMemo(() => {
    void version; // re-runs the read after a sync
    return readCategories(db);
  }, [db, version]);
}

/** Every product with the customer's price in name order; prices stay null without a customer. */
export function usePricedProducts(counterpartyId: string | null): PricedProduct[] {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  return useMemo(
    () => cachedPricedProducts(db, version, counterpartyId),
    [db, counterpartyId, version],
  );
}

export function usePricedProduct(
  productId: number,
  counterpartyId: string | null,
): PricedProduct | null {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  return useMemo(() => {
    void version; // re-runs the read after a sync
    return readPricedProduct(
      db,
      productId,
      counterpartyId ? readCustomerPricing(db, counterpartyId) : null,
    );
  }, [db, productId, counterpartyId, version]);
}
