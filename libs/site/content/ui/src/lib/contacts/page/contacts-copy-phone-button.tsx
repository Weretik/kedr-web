'use client';

import { Button, cn } from '@site/shared/ui';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useId, useRef, useState } from 'react';

type ContactsCopyPhoneButtonProps = {
  e164: string;
  copyLabel: string;
  copiedLabel: string;
  fallbackLabel: string;
};

type CopyState = 'idle' | 'pending' | 'success' | 'error';

/** Local clipboard feedback; the adjacent telephone link remains an independent action. */
export function ContactsCopyPhoneButton({
  e164,
  copyLabel,
  copiedLabel,
  fallbackLabel,
}: ContactsCopyPhoneButtonProps) {
  const [state, setState] = useState<CopyState>('idle');
  const requestPending = useRef(false);
  const statusId = useId();

  const copy = async () => {
    if (requestPending.current) return;
    requestPending.current = true;
    setState('pending');
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(e164);
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
        variant="ghost"
        size="icon"
        onClick={copy}
        disabled={state === 'pending'}
        aria-busy={state === 'pending'}
        aria-label={copyLabel}
        aria-describedby={statusId}
        title={copyLabel}
        className="size-11 text-muted-foreground"
      >
        {state === 'success' ? (
          <CheckIcon aria-hidden className="text-brand-text" strokeWidth={1.75} />
        ) : (
          <CopyIcon aria-hidden strokeWidth={1.75} />
        )}
      </Button>
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={cn(
          'min-h-6 basis-full text-xs leading-5',
          state === 'success' ? 'text-brand-text' : 'text-muted-foreground',
        )}
      >
        {state === 'success' ? copiedLabel : null}
        {state === 'error' ? (
          <>
            {fallbackLabel} <span className="select-text whitespace-nowrap">{e164}</span>
          </>
        ) : null}
      </p>
    </>
  );
}
