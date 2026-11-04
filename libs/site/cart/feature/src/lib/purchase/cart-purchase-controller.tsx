'use client';

import { isCartQuantity } from '@site/cart/model';
import { CartPurchaseControl } from '@site/cart/ui';
import { useEffect, useRef, useState } from 'react';

import { useCart } from '../runtime/cart-provider';

import type { CartPurchaseInput } from '@site/cart/model';
import type { Locale } from '@site/core/i18n';

export function CartPurchaseController({
  locale,
  input,
}: {
  locale: Locale;
  input: CartPurchaseInput;
}) {
  const { store, snapshot } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <CartPurchaseControl
      locale={locale}
      quantity={quantity}
      onQuantityChange={(value) => {
        if (isCartQuantity(value)) setQuantity(value);
      }}
      onAdd={() => {
        setAdded(false);
        if (timer.current) {
          clearTimeout(timer.current);
          timer.current = undefined;
        }
        if (!store?.add(input, quantity)) return;
        setAdded(true);
        timer.current = setTimeout(() => {
          setAdded(false);
        }, 1500);
      }}
      disabled={!snapshot.hydrated || snapshot.pending || snapshot.recoveryRequired}
      added={added}
      message={snapshot.notice ?? snapshot.storageIssue}
    />
  );
}
