import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { AlertCircleIcon, ArrowRightIcon, LoaderCircleIcon } from 'lucide-react';
import Link from 'next/link';

import { getCartCopy } from '../i18n/cart-copy';
import { cartMessage } from '../i18n/cart-messages';
import { formatCartCount, formatCartMoney } from '../shared/cart-format';

import type { CheckoutViewProps } from '../types/cart-ui-props';

type CheckoutSummaryProps = Pick<
  CheckoutViewProps,
  'locale' | 'pending' | 'canSubmit' | 'formMessages' | 'resultKind'
> & {
  unitCount: number;
  goodsSubtotal: number;
};

export function CheckoutSummary({
  locale,
  pending,
  canSubmit,
  formMessages,
  resultKind,
  unitCount,
  goodsSubtotal,
}: CheckoutSummaryProps) {
  const copy = getCartCopy(locale);
  const fallback =
    resultKind === 'validation'
      ? copy.validationFallback
      : resultKind === 'conflict'
        ? copy.conflictFallback
        : resultKind === 'uncertain'
          ? copy.uncertainFallback
          : null;
  const messages = formMessages
    .filter((message) => message.trim())
    .map((message) => cartMessage(locale, message));
  if (!messages.length && fallback) messages.push(fallback);
  return (
    <div className="mt-6 border-t border-border pt-5">
      <dl className="grid min-w-0 gap-3 text-sm">
        <div className="flex min-w-0 justify-between gap-3">
          <dt className="min-w-0 text-muted-foreground">
            {copy.goods} ({formatCartCount(locale, unitCount)} {copy.units})
          </dt>
          <dd className="min-w-0 text-right tabular-nums [overflow-wrap:anywhere]">
            {formatCartMoney(locale, goodsSubtotal)}
          </dd>
        </div>
        <div className="flex min-w-0 justify-between gap-3">
          <dt className="text-muted-foreground">{copy.shipping}</dt>
          <dd className="min-w-0 text-right">{copy.shippingValue}</dd>
        </div>
        <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2 pt-1">
          <dt className="font-semibold">{copy.goodsTotal}</dt>
          <dd className="ml-auto min-w-0 text-2xl font-bold tracking-tight tabular-nums [overflow-wrap:anywhere]">
            {formatCartMoney(locale, goodsSubtotal)}
          </dd>
        </div>
      </dl>
      <p className="mt-2 mb-5 text-xs leading-relaxed text-muted-foreground">{copy.totalNote}</p>
      {messages.length > 0 && (
        <div
          role="alert"
          className="mb-4 flex min-w-0 items-start gap-2 rounded-lg bg-warning-soft p-3 text-sm leading-relaxed text-foreground"
        >
          <AlertCircleIcon
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-warning"
            strokeWidth={1.75}
          />
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <ul className="grid gap-2">
              {messages.map((message, index) => (
                <li key={`${message}-${index}`}>{message}</li>
              ))}
            </ul>
            {(resultKind === 'uncertain' || resultKind === 'conflict') && (
              <a
                href={`tel:${COMPANY.phone.e164}`}
                className="mt-2 inline-flex min-h-11 items-center font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {COMPANY.phone.display}
              </a>
            )}
          </div>
        </div>
      )}
      <Button
        type="submit"
        disabled={!canSubmit || pending}
        className="h-auto min-h-12 w-full min-w-0 py-3 whitespace-normal"
      >
        {pending && (
          <LoaderCircleIcon aria-hidden className="motion-safe:animate-spin" strokeWidth={1.75} />
        )}
        {pending ? copy.sending : copy.send}
        {!pending && <ArrowRightIcon aria-hidden strokeWidth={1.75} />}
      </Button>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        {copy.legalStart}{' '}
        <Link
          href={localizedPath(locale, '/public-offer')}
          className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {copy.offer}
        </Link>{' '}
        {copy.legalAnd}{' '}
        <Link
          href={localizedPath(locale, '/privacy-policy')}
          className="underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {copy.privacy}
        </Link>
        .
      </p>
    </div>
  );
}
