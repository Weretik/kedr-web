'use client';

import { UserRoundIcon } from 'lucide-react';
import { useId } from 'react';

import { getCartCopy } from '../i18n/cart-copy';
import { fieldMessage } from '../i18n/cart-messages';

import type { CheckoutViewProps } from '../types/cart-ui-props';
import type { CheckoutField } from '@site/cart/model';

type CheckoutContactsProps = Pick<
  CheckoutViewProps,
  'locale' | 'draft' | 'fieldErrors' | 'onDraftChange' | 'onFieldBlur'
> & { disabled: boolean };

export function CheckoutContacts({
  locale,
  draft,
  fieldErrors,
  disabled,
  onDraftChange,
  onFieldBlur,
}: CheckoutContactsProps) {
  const copy = getCartCopy(locale);
  const prefix = useId();
  const fields: CheckoutField[] = ['firstName', 'phone'];
  return (
    <div>
      <h2 className="flex items-center gap-2.5 text-xl font-bold tracking-tight">
        <UserRoundIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
        {copy.yourContacts}
      </h2>
      <p className="mt-2 mb-5 text-sm leading-relaxed text-muted-foreground">{copy.formNote}</p>
      <div className="grid gap-4">
        {fields.map((field) => {
          const errors = fieldErrors[field] ?? [];
          const inputId = `${prefix}-${field}`;
          const errorId = `${inputId}-errors`;
          const isName = field === 'firstName';
          return (
            <div key={field} className="grid min-w-0 gap-2">
              <label htmlFor={inputId} className="text-sm font-semibold">
                {isName ? copy.name : copy.phone}
                <span aria-hidden className="ml-1 text-muted-foreground">
                  *
                </span>
              </label>
              <input
                id={inputId}
                name={field}
                type={isName ? 'text' : 'tel'}
                inputMode={isName ? 'text' : 'tel'}
                autoComplete={isName ? 'given-name' : 'tel'}
                required
                maxLength={isName ? 30 : 20}
                minLength={isName ? 3 : undefined}
                disabled={disabled}
                value={draft[field]}
                placeholder={isName ? copy.namePlaceholder : '+38 (0__) ___-__-__'}
                aria-invalid={errors.length > 0}
                aria-describedby={errors.length ? errorId : undefined}
                className={`h-12 w-full min-w-0 rounded-md border bg-background px-3 py-2 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60 ${errors.length ? 'border-warning' : 'border-input'}`}
                onChange={(event) => {
                  if (!disabled) onDraftChange(field, event.currentTarget.value);
                }}
                onBlur={() => {
                  if (!disabled) onFieldBlur(field);
                }}
              />
              {errors.length > 0 && (
                <ul
                  id={errorId}
                  role="alert"
                  className="grid gap-1 text-xs leading-relaxed text-warning [overflow-wrap:anywhere]"
                >
                  {errors.map((error, index) => (
                    <li key={`${error}-${index}`}>{fieldMessage(locale, field, error)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
