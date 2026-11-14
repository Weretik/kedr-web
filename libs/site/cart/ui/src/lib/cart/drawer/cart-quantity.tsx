'use client';

import { isCartQuantity, MAX_CART_QUANTITY, MIN_CART_QUANTITY } from '@site/cart/model';
import { Button } from '@site/shared/ui';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useId, useState } from 'react';

import { getCartCopy } from '../../i18n/cart-copy';

import type { Locale } from '@site/core/i18n';

type CartQuantityProps = {
  locale: Locale;
  quantity: number;
  onChange: (quantity: number) => void;
  disabled: boolean;
  title?: string;
};

/** A transient invalid edit never changes the basket or implicitly deletes its line. */
export function CartQuantity({ locale, quantity, onChange, disabled, title }: CartQuantityProps) {
  const copy = getCartCopy(locale);
  const errorId = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [rejected, setRejected] = useState(false);
  const invalid = draft !== null && !isCartQuantity(Number(draft));
  const describe = (label: string) => (title ? `${label}: ${title}` : label);
  const resetInvalid = () => {
    if (!invalid) return;
    setDraft(null);
    setRejected(true);
  };
  const step = (value: number) => {
    setDraft(null);
    setRejected(false);
    if (!disabled && isCartQuantity(value)) onChange(value);
  };

  return (
    <div className="min-w-0">
      <div className="inline-flex max-w-full items-center rounded-md border border-input bg-background">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label={describe(copy.decrease)}
          disabled={disabled || quantity <= MIN_CART_QUANTITY}
          onClick={() => step(quantity - 1)}
        >
          <MinusIcon aria-hidden strokeWidth={1.75} />
        </Button>
        <input
          type="number"
          inputMode="numeric"
          min={MIN_CART_QUANTITY}
          max={MAX_CART_QUANTITY}
          step={1}
          aria-label={describe(copy.quantity)}
          aria-invalid={invalid}
          aria-describedby={invalid || rejected ? errorId : undefined}
          disabled={disabled}
          value={draft ?? quantity}
          className="h-11 w-10 min-w-0 appearance-textfield bg-transparent p-0 text-center text-base text-foreground outline-none tabular-nums focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-inner-spin-button]:appearance-none"
          onChange={(event) => {
            const value = event.currentTarget.value;
            setRejected(false);
            if (isCartQuantity(Number(value))) {
              setDraft(null);
              if (!disabled) onChange(Number(value));
            } else setDraft(value);
          }}
          onBlur={resetInvalid}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              resetInvalid();
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-11 shrink-0"
          aria-label={describe(copy.increase)}
          disabled={disabled || quantity >= MAX_CART_QUANTITY}
          onClick={() => step(quantity + 1)}
        >
          <PlusIcon aria-hidden strokeWidth={1.75} />
        </Button>
      </div>
      {(invalid || rejected) && (
        <p id={errorId} role="alert" className="mt-2 max-w-64 text-xs text-foreground">
          {copy.quantityError}
        </p>
      )}
    </div>
  );
}
