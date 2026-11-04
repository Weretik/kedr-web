'use client';

import { Button } from '@site/shared/ui';
import { PackageIcon, Trash2Icon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import styles from './cart-line.module.css';
import { CartQuantity } from './cart-quantity';
import { getCartCopy } from '../i18n/cart-copy';
import { formatCartMoney } from '../shared/cart-format';

import type { CartLineView } from '../types/cart-ui-props';
import type { Locale } from '@site/core/i18n';

type CartLineProps = {
  locale: Locale;
  line: CartLineView;
  disabled: boolean;
  onChangeQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
};

export function CartLine({ locale, line, disabled, onChangeQuantity, onRemove }: CartLineProps) {
  const copy = getCartCopy(locale);
  const { title, imageUrl, unitPrice } = line.snapshot;
  const { productHref } = line;
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const hasPhoto = Boolean(imageUrl && failedImage !== imageUrl);

  return (
    <article
      aria-label={title}
      className={`${styles.line} border-b border-border py-5 last:border-b-0 last:pb-0`}
    >
      <div className={styles.layout}>
        <div
          className={`${styles.photo} relative aspect-[0.82] w-full overflow-hidden rounded-lg ${hasPhoto ? 'bg-white' : 'bg-muted'}`}
        >
          {hasPhoto && imageUrl ? (
            <Image
              src={imageUrl}
              alt={title}
              fill
              unoptimized
              sizes="56px"
              className="object-contain p-1"
              onError={() => setFailedImage(imageUrl)}
            />
          ) : (
            <span
              role="img"
              aria-label={copy.noPhoto}
              className="absolute inset-0 grid place-items-center text-muted-foreground"
            >
              <PackageIcon aria-hidden className="size-6" strokeWidth={1.75} />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-sm leading-relaxed font-semibold [overflow-wrap:anywhere]">
            {productHref ? (
              <Link
                href={productHref}
                className="underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          <p className="mt-1 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
            {copy.sku} {line.variantId}
          </p>
          <div className="mt-3 flex min-w-0 flex-wrap items-start gap-2.5">
            <CartQuantity
              locale={locale}
              quantity={line.quantity}
              disabled={disabled}
              title={title}
              onChange={(value) => onChangeQuantity(line.variantId, value)}
            />
            <p className="min-w-0 pt-3 text-xs text-muted-foreground tabular-nums [overflow-wrap:anywhere]">
              {formatCartMoney(locale, unitPrice)} / {copy.units}
            </p>
          </div>
        </div>
        <div className={styles.end}>
          <strong className="min-w-0 max-w-28 text-sm font-bold tabular-nums [overflow-wrap:anywhere]">
            {formatCartMoney(locale, unitPrice * line.quantity)}
          </strong>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 text-muted-foreground hover:text-foreground"
            disabled={disabled}
            aria-label={`${copy.remove}: ${title}`}
            onClick={() => onRemove(line.variantId)}
          >
            <Trash2Icon aria-hidden strokeWidth={1.75} />
          </Button>
        </div>
      </div>
    </article>
  );
}
