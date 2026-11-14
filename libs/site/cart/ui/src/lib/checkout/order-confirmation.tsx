import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { ArrowRightIcon, CheckIcon } from 'lucide-react';
import Link from 'next/link';

import { CartHelp, CartServiceNote } from './cart-support';
import { getCartCopy } from '../i18n/cart-copy';
import { formatCartCount, formatCartMoney } from '../i18n/cart-format';

import type { CheckoutReceipt } from '../cart/cart-ui-props';
import type { CompanyContacts } from '@site/core/config';
import type { Locale } from '@site/core/i18n';

const shortOrderNumber = (orderId: string) => orderId.replace(/-/g, '').slice(0, 8).toUpperCase();

export function OrderConfirmation({
  locale,
  receipt,
  phone,
}: {
  locale: Locale;
  receipt: CheckoutReceipt;
  phone: CompanyContacts['phone'];
}) {
  const copy = getCartCopy(locale);
  return (
    <section
      role="status"
      aria-live="polite"
      className="mx-auto grid w-full max-w-2xl min-w-0 gap-5"
    >
      <div className="text-center">
        <div className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-brand-soft text-brand-text">
          <CheckIcon aria-hidden className="size-7" strokeWidth={1.75} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{copy.successTitle}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
          {copy.successText}
        </p>
      </div>
      <div className="min-w-0 rounded-xl border border-border bg-card p-5 sm:p-6">
        <p className="text-xs text-muted-foreground">{copy.reference}</p>
        {/* The first 8 characters are what managers see first in the Telegram order message. */}
        <p className="mt-2 font-mono text-lg font-semibold tracking-wider">
          {shortOrderNumber(receipt.orderId)}
        </p>
        <dl className="mt-5 grid min-w-0 gap-3 border-t border-border pt-5 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{copy.goods}</dt>
            <dd className="tabular-nums">
              {formatCartCount(locale, receipt.unitCount)} {copy.units}
            </dd>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
            <dt className="font-medium">{copy.goodsTotal}</dt>
            <dd className="min-w-0 text-2xl font-bold tabular-nums [overflow-wrap:anywhere]">
              {formatCartMoney(locale, receipt.goodsSubtotal)}
            </dd>
          </div>
        </dl>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy.totalNote}</p>
      </div>
      <CartServiceNote locale={locale} confirmation />
      <CartHelp locale={locale} phone={phone} />
      <div className="text-center">
        <Button asChild className="h-auto min-h-12 max-w-full py-3 whitespace-normal">
          <Link href={localizedPath(locale, '/catalog')}>
            {copy.toCatalog}
            <ArrowRightIcon aria-hidden strokeWidth={1.75} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
