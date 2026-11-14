'use client';

import { Button, cn } from '@site/shared/ui';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useId, useRef, useState } from 'react';

type RequisitesCopyButtonProps = {
  text: string;
  label: string;
  copiedLabel: string;
  fallbackLabel: string;
  variant?: 'icon' | 'default';
};

type CopyState = 'idle' | 'pending' | 'success' | 'error';

/** Local clipboard feedback for a supplied IBAN or complete text payload. */
export function RequisitesCopyButton({
  text,
  label,
  copiedLabel,
  fallbackLabel,
  variant = 'default',
}: RequisitesCopyButtonProps) {
  const [state, setState] = useState<CopyState>('idle');
  const requestPending = useRef(false);
  const statusId = useId();
  const iconOnly = variant === 'icon';

  const copy = async () => {
    if (requestPending.current) return;
    requestPending.current = true;
    setState('pending');

    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      setState('success');
    } catch {
      setState('error');
    } finally {
      requestPending.current = false;
    }
  };

  return (
    <>
      <Button
        type="button"
        variant={iconOnly ? 'ghost' : 'default'}
        size={iconOnly ? 'icon' : 'default'}
        onClick={copy}
        disabled={state === 'pending'}
        aria-busy={state === 'pending'}
        aria-label={label}
        aria-describedby={statusId}
        title={label}
        className={
          iconOnly
            ? 'size-11 text-muted-foreground'
            : 'h-auto min-h-11 w-full whitespace-normal py-2.5'
        }
      >
        {state === 'success' ? (
          <CheckIcon
            aria-hidden
            className={iconOnly ? 'text-brand-text' : undefined}
            strokeWidth={1.75}
          />
        ) : (
          <CopyIcon aria-hidden strokeWidth={1.75} />
        )}
        {!iconOnly && label}
      </Button>
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'col-span-full min-h-6 min-w-0 text-xs leading-5',
          state === 'success' ? 'text-brand-text' : 'text-muted-foreground',
        )}
      >
        {state === 'success' ? copiedLabel : null}
        {state === 'error' ? (
          <>
            {fallbackLabel}
            <span className="mt-2 block select-text whitespace-pre-wrap [overflow-wrap:anywhere]">
              {text}
            </span>
          </>
        ) : null}
      </p>
    </>
  );
}
