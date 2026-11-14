'use client';

import { Button } from '@site/shared/ui';
import { PrinterIcon } from 'lucide-react';
import { useSyncExternalStore } from 'react';

const subscribeToHydration = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/** Browser print is available after hydration; the document needs no client copy. */
export function PublicOfferPrintButton({ label, hint }: { label: string; hint: string }) {
  const hydrated = useSyncExternalStore(subscribeToHydration, getClientSnapshot, getServerSnapshot);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        disabled={!hydrated}
        className="h-auto min-h-11 w-full max-w-full whitespace-normal py-2.5 sm:w-auto"
        onClick={() => window.print()}
      >
        <PrinterIcon aria-hidden strokeWidth={1.75} />
        {label}
      </Button>
      <noscript>
        <p className="mt-3 max-w-xs text-sm leading-6 text-muted-foreground">{hint}</p>
      </noscript>
    </>
  );
}
