'use client';

import { cn } from '@site/shared/ui';
import { CheckIcon, PhoneIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

type CopyPhoneButtonProps = {
  phone: { display: string; e164: string };
  copyLabel: string;
  copiedLabel: string;
  className?: string;
};

/** Shows the phone number and copies it on click; a copy confirmation is announced to screen readers. */
export function CopyPhoneButton({
  phone,
  copyLabel,
  copiedLabel,
  className,
}: CopyPhoneButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(phone.e164);
      setCopied(true);
    } catch {
      window.location.href = `tel:${phone.e164}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={copyLabel}
      aria-label={`${copyLabel}: ${phone.display}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold whitespace-nowrap hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        className,
      )}
    >
      {copied ? (
        <CheckIcon className="size-4 text-brand" strokeWidth={1.75} />
      ) : (
        <PhoneIcon className="size-4" strokeWidth={1.75} />
      )}
      <span>{phone.display}</span>
      <span className="sr-only" aria-live="polite">
        {copied ? copiedLabel : ''}
      </span>
    </button>
  );
}
