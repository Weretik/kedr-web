'use client';

import { Button } from '@site/shared/ui';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';

import { getCartCopy } from '../i18n/cart-copy';
import { cartMessage, storageMessage } from '../i18n/cart-messages';

import type { BasketProps } from '../types/cart-ui-props';

type CartNoticesProps = Pick<
  BasketProps,
  | 'locale'
  | 'pending'
  | 'recovery'
  | 'storageIssue'
  | 'notice'
  | 'onAcceptRecovery'
  | 'onDiscardRecovery'
>;

export function CartNotices({
  locale,
  pending,
  recovery,
  storageIssue,
  notice,
  onAcceptRecovery,
  onDiscardRecovery,
}: CartNoticesProps) {
  const copy = getCartCopy(locale);
  return (
    <div className="grid min-w-0 gap-3 empty:hidden">
      {recovery && (
        <section
          role="alert"
          className="rounded-lg border border-warning/40 bg-warning-soft p-4 text-sm text-foreground"
        >
          <h3 className="flex items-start gap-2 font-semibold">
            <AlertCircleIcon
              aria-hidden
              className="size-5 shrink-0 text-warning"
              strokeWidth={1.75}
            />
            {copy.recoveryTitle}
          </h3>
          <p className="mt-2 leading-relaxed">{copy.recoveryText}</p>
          <p className="mt-2 text-xs">
            {recovery.discardedCount === null
              ? copy.recoveryUnknown
              : `${copy.recoveryCount}: ${recovery.discardedCount}.`}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              disabled={pending}
              onClick={onAcceptRecovery}
              className="h-auto min-h-11 max-w-full py-2.5 whitespace-normal"
            >
              {copy.acceptRecovery}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pending}
              onClick={onDiscardRecovery}
              className="h-auto min-h-11 max-w-full py-2.5 whitespace-normal"
            >
              {copy.discardRecovery}
            </Button>
          </div>
        </section>
      )}
      {storageIssue && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-warning-soft p-4 text-sm text-foreground"
        >
          <InfoIcon
            aria-hidden
            className="mt-0.5 size-4 shrink-0 text-warning"
            strokeWidth={1.75}
          />
          <div className="min-w-0 [overflow-wrap:anywhere]">
            <p className="font-medium">{storageMessage(locale, storageIssue)}</p>
            <p className="mt-1 leading-relaxed">{copy.storageDetail}</p>
          </div>
        </div>
      )}
      {notice && (
        <p
          role="status"
          className="text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]"
        >
          {cartMessage(locale, notice)}
        </p>
      )}
    </div>
  );
}
