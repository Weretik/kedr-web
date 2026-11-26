'use client';

import { useId } from 'react';

import { getCartCopy } from '../../i18n/cart-copy';
import { fieldMessage } from '../../i18n/cart-messages';

import type { CheckoutViewProps } from '../../cart/drawer/cart-ui-props';

type CheckoutCommentProps = Pick<
  CheckoutViewProps,
  'locale' | 'draft' | 'fieldErrors' | 'onDraftChange' | 'onFieldBlur'
> & { disabled: boolean };

/** Optional note for the order, under the phone; the backend keeps at most 800 characters. */
export function CheckoutComment({
  locale,
  draft,
  fieldErrors,
  disabled,
  onDraftChange,
  onFieldBlur,
}: CheckoutCommentProps) {
  const copy = getCartCopy(locale);
  const inputId = useId();
  const errorId = `${inputId}-errors`;
  const errors = fieldErrors.comment ?? [];
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={inputId} className="text-sm font-semibold">
        {copy.comment}
      </label>
      <textarea
        id={inputId}
        name="comment"
        rows={3}
        disabled={disabled}
        value={draft.comment ?? ''}
        placeholder={copy.commentPlaceholder}
        aria-invalid={errors.length > 0}
        aria-describedby={errors.length ? errorId : undefined}
        className={`w-full min-w-0 resize-y rounded-md border bg-background px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${errors.length ? 'border-warning' : 'border-input'}`}
        onChange={(event) => {
          if (!disabled) onDraftChange('comment', event.currentTarget.value);
        }}
        onBlur={() => {
          if (!disabled) onFieldBlur('comment');
        }}
      />
      {errors.length > 0 && (
        <ul
          id={errorId}
          role="alert"
          className="grid gap-1 text-xs leading-relaxed text-warning [overflow-wrap:anywhere]"
        >
          {errors.map((error, index) => (
            <li key={`${error}-${index}`}>{fieldMessage(locale, 'comment', error)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
