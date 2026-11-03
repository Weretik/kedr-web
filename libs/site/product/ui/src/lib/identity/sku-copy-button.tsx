'use client';

import { Button } from '@site/shared/ui';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';

/** Clipboard leaf: feedback follows the platform result, never the click itself. */
export function SkuCopyButton({ locale, sku }: { locale: Locale; sku: string }) {
  const dictionary = getProductDictionary(locale);
  const [result, setResult] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [pending, setPending] = useState(false);
  const copySku = async () => {
    setResult('idle');
    setPending(true);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(sku);
      setResult('copied');
    } catch {
      setResult('failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <span className="inline-flex min-w-0 flex-wrap items-center gap-1.5 font-sans">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-11 shrink-0 text-muted-foreground"
        aria-label={dictionary.copySku}
        disabled={pending}
        onClick={copySku}
      >
        {result === 'copied' ? (
          <CheckIcon aria-hidden className="text-brand-text" strokeWidth={1.75} />
        ) : (
          <CopyIcon aria-hidden strokeWidth={1.75} />
        )}
      </Button>
      <span role="status" aria-live="polite" className="max-w-64 text-xs text-muted-foreground">
        {result === 'copied'
          ? dictionary.copiedSku
          : result === 'failed'
            ? dictionary.copyFailed
            : ''}
      </span>
    </span>
  );
}
