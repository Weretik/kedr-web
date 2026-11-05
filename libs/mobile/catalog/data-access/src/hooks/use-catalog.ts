import { useLocalDatabase, useLocalDataVersion } from '@mobile/core/local-db';
import { useMemo } from 'react';

import {
  readCategories,
  readCustomerPricing,
  readPricedProduct,
  readPricedProducts,
} from '../queries/catalog-queries';

import type { Category, PricedProduct } from '@mobile/catalog/model';

export function useCategories(): Category[] {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `version` re-runs the read after a sync.
  return useMemo(() => readCategories(db), [db, version]);
}

/** Every product with the customer's price; prices stay null without a customer. */
export function usePricedProducts(counterpartyId: string | null): PricedProduct[] {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  return useMemo(
    () => readPricedProducts(db, counterpartyId ? readCustomerPricing(db, counterpartyId) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `version` re-runs the read after a sync.
    [db, counterpartyId, version],
  );
}

export function usePricedProduct(
  productId: number,
  counterpartyId: string | null,
): PricedProduct | null {
  const db = useLocalDatabase();
  const version = useLocalDataVersion();
  return useMemo(
    () =>
      readPricedProduct(
        db,
        productId,
        counterpartyId ? readCustomerPricing(db, counterpartyId) : null,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `version` re-runs the read after a sync.
    [db, productId, counterpartyId, version],
  );
}
