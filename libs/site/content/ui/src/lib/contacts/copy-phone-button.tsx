'use client';

import { Button, cn } from '@site/shared/ui';
import { CheckIcon, CopyIcon } from 'lucide-react';

import { useCopyPhone } from '../hooks/use-copy-phone';

export type CopyPhoneButtonProps = {
  phone: string;
  copyLabel: string;
  copiedLabel: string;
  errorLabel: string;
};

/** Presents clipboard state; the hook owns the browser operation and lifecycle. */
export function CopyPhoneButton({
  phone,
  copyLabel,
  copiedLabel,
  errorLabel,
}: CopyPhoneButtonProps) {
  const { status, copy } = useCopyPhone(phone);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={copy}
        disabled={status === 'pending'}
        aria-label={copyLabel}
        title={copyLabel}
        className="text-muted-foreground hover:text-foreground"
      >
        {status === 'success' ? (
          <CheckIcon aria-hidden className="text-brand-text" strokeWidth={1.75} />
        ) : (
          <CopyIcon aria-hidden strokeWidth={1.75} />
        )}
      </Button>
      <span
        role="status"
        aria-atomic="true"
        className={cn(
          'basis-full text-sm',
          status === 'error' ? 'text-warning' : 'text-muted-foreground',
          (status === 'idle' || status === 'pending') && 'sr-only',
        )}
      >
        {status === 'success' ? copiedLabel : status === 'error' ? errorLabel : ''}
      </span>
    </>
  );
}
