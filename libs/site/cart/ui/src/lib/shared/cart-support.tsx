import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import { PhoneIcon, TruckIcon } from 'lucide-react';
import Link from 'next/link';

import { getCartCopy } from '../i18n/cart-copy';

import type { Locale } from '@site/core/i18n';

export function CartServiceNote({
  locale,
  confirmation = false,
}: {
  locale: Locale;
  confirmation?: boolean;
}) {
  const copy = getCartCopy(locale);
  const Icon = confirmation ? PhoneIcon : TruckIcon;
  return (
    <section className="flex min-w-0 items-start gap-3 rounded-xl bg-brand-soft p-5">
      <Icon aria-hidden className="mt-0.5 size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
      <div className="min-w-0">
        <h3 className="text-sm font-semibold">
          {confirmation ? copy.nextTitle : copy.serviceTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/80">
          {confirmation ? copy.nextText : copy.serviceText}
        </p>
        <Link
          href={localizedPath(locale, '/delivery-and-payment')}
          className="mt-2 inline-block text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {copy.deliveryLink}
        </Link>
      </div>
    </section>
  );
}

export function CartHelp({ locale }: { locale: Locale }) {
  const copy = getCartCopy(locale);
  return (
    <div className="flex items-start gap-3 px-1 text-sm">
      <PhoneIcon
        aria-hidden
        className="mt-0.5 size-4 shrink-0 text-brand-text"
        strokeWidth={1.75}
      />
      <div>
        <p className="text-muted-foreground">{copy.help}</p>
        <a
          href={`tel:${COMPANY.phone.e164}`}
          className="mt-1 inline-flex min-h-11 items-center font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {COMPANY.phone.display}
        </a>
      </div>
    </div>
  );
}
