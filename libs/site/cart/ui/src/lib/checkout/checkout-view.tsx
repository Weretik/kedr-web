'use client';

import { getCartTotals } from '@site/cart/model';
import { ShoppingBagIcon } from 'lucide-react';

import { CheckoutContacts } from './checkout-contacts';
import { CheckoutLoading } from './checkout-loading';
import { CheckoutSummary } from './checkout-summary';
import styles from './checkout-view.module.css';
import { OrderConfirmation } from './order-confirmation';
import { CartEmpty } from '../cart/cart-empty';
import { CartLine } from '../cart/cart-line';
import { CartNotices } from '../cart/cart-notices';
import { getCartCopy } from '../i18n/cart-copy';
import { formatCartCount } from '../shared/cart-format';
import { CartHelp, CartServiceNote } from '../shared/cart-support';

import type { CheckoutViewProps } from '../types/cart-ui-props';

const HONEYPOT_FIELD = 'company_website';

/** Presentational body; the route's server frame owns the sole H1 above its Suspense boundary. */
export function CheckoutView(props: CheckoutViewProps) {
  const {
    locale,
    lines,
    restoring,
    pending,
    recovery,
    receipt,
    phone,
    onChangeQuantity,
    onRemove,
    onSubmit,
  } = props;
  const copy = getCartCopy(locale);
  if (receipt)
    return (
      <div className="grid gap-5">
        <CartNotices {...props} recovery={null} notice={null} />
        <OrderConfirmation locale={locale} receipt={receipt} phone={phone} />
      </div>
    );
  if (restoring) return <CheckoutLoading locale={locale} />;
  if (!lines.length)
    return (
      <div className="grid gap-5">
        <CartNotices {...props} />
        {!recovery && <CartEmpty locale={locale} />}
      </div>
    );
  const { unitCount, goodsSubtotal } = getCartTotals(lines);
  const blocked = pending || recovery !== null;
  const canSubmit = props.canSubmit && !blocked;
  return (
    <div className="grid min-w-0 gap-5">
      <CartNotices {...props} />
      <div className={styles.container}>
        <div className={styles.layout}>
          <div className="grid min-w-0 gap-5">
            <section
              className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"
              aria-label={copy.yourOrder}
            >
              <div className="flex min-w-0 flex-wrap items-start justify-between gap-2 border-b border-border pb-4">
                <h2 className="flex min-w-0 items-center gap-2.5 text-xl font-bold tracking-tight">
                  <ShoppingBagIcon
                    aria-hidden
                    className="size-5 shrink-0 text-brand-text"
                    strokeWidth={1.75}
                  />
                  {copy.yourOrder}
                </h2>
                <p className="pt-1 text-xs text-muted-foreground">
                  {copy.positions}: {lines.length} · {formatCartCount(locale, unitCount)}{' '}
                  {copy.units}
                </p>
              </div>
              <div>
                {lines.map((line) => (
                  <CartLine
                    key={line.variantId}
                    locale={locale}
                    line={line}
                    disabled={blocked}
                    onChangeQuantity={onChangeQuantity}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </section>
            <CartServiceNote locale={locale} />
          </div>
          <div className="grid min-w-0 gap-5">
            <form
              aria-label={copy.checkout}
              aria-busy={pending}
              noValidate
              className="min-w-0 rounded-xl border border-border bg-card p-4 sm:p-5"
              onSubmit={(event) => {
                event.preventDefault();
                if (blocked) return;
                // Bots fill every field; people never see this one.
                const trap = event.currentTarget.elements.namedItem(HONEYPOT_FIELD);
                if (trap instanceof HTMLInputElement && trap.value) return;
                if (!canSubmit) {
                  props.onFieldBlur('firstName');
                  props.onFieldBlur('phone');
                  return;
                }
                onSubmit();
              }}
            >
              <input
                type="text"
                name={HONEYPOT_FIELD}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute -left-[9999px] size-px opacity-0"
              />
              <CheckoutContacts {...props} disabled={blocked} />
              <CheckoutSummary
                {...props}
                unitCount={unitCount}
                goodsSubtotal={goodsSubtotal}
                canSubmit={canSubmit}
              />
            </form>
            <CartHelp locale={locale} phone={phone} />
          </div>
        </div>
      </div>
    </div>
  );
}
