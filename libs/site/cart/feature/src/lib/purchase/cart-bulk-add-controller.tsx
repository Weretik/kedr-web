'use client';

import { CartBulkAddTable } from '@site/cart/ui';
import { useState } from 'react';

import { useCart } from '../runtime/cart-provider';

import type { CartPurchaseInput } from '@site/cart/model';
import type { CartBulkRowView } from '@site/cart/ui';
import type { Locale } from '@site/core/i18n';

export type CartBulkRow = { view: CartBulkRowView; input: CartPurchaseInput };

/** Adds every row with a quantity and opens the drawer; a rejected row stops and shows the cart notice. */
export function CartBulkAddController({
  locale,
  rows,
}: {
  locale: Locale;
  rows: readonly CartBulkRow[];
}) {
  const { store, snapshot } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);
  return (
    <CartBulkAddTable
      locale={locale}
      rows={rows.map((row) => row.view)}
      quantities={quantities}
      onQuantityChange={(id, quantity) => {
        setMessage(null);
        setQuantities((current) => ({ ...current, [id]: quantity }));
      }}
      onAdd={(opener) => {
        const chosen = rows.filter(
          (row) => row.view.purchasable && (quantities[row.view.id] ?? 0) > 0,
        );
        if (!chosen.length) {
          setMessage('bulk-empty');
          return;
        }
        for (const row of chosen) {
          if (!store?.add(row.input, quantities[row.view.id]!)) {
            setMessage(store?.getSnapshot().notice ?? 'invalid-product');
            return;
          }
        }
        setQuantities({});
        setMessage('bulk-added');
        store?.openDrawer(opener);
      }}
      disabled={!snapshot.hydrated || snapshot.pending || snapshot.recoveryRequired}
      message={message}
    />
  );
}
