'use client';

import { CheckoutView } from '@site/cart/ui';

import { canSubmitCheckout, checkoutFieldErrors } from './checkout-selectors';
import { cartViewProps } from '../cart/cart-view-props';
import { useCart } from '../runtime/cart-provider';

import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

export function CheckoutController({
  locale,
  phone,
}: {
  locale: Locale;
  phone: CompanyContacts['phone'];
}) {
  const { store, snapshot } = useCart();
  return (
    <CheckoutView
      {...cartViewProps(locale, snapshot, store)}
      draft={snapshot.draft}
      fieldErrors={checkoutFieldErrors(snapshot)}
      formMessages={
        snapshot.result && snapshot.result.kind !== 'created' ? snapshot.result.messages : []
      }
      resultKind={snapshot.result?.kind ?? null}
      receipt={snapshot.receipt}
      canSubmit={canSubmitCheckout(snapshot)}
      phone={phone}
      onDraftChange={(field, value) => {
        store?.setDraft(field, value);
      }}
      onFieldBlur={(field) => {
        store?.touch(field);
      }}
      onSubmit={() => {
        void store?.submit();
      }}
    />
  );
}
