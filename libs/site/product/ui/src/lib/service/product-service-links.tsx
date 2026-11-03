import { COMPANY } from '@site/core/config';
import { localizedPath } from '@site/core/i18n';
import {
  ArrowUpRightIcon,
  ChevronRightIcon,
  HandshakeIcon,
  PhoneIcon,
  ShieldCheckIcon,
  TruckIcon,
  WalletIcon,
} from 'lucide-react';
import Link from 'next/link';

import { getProductDictionary } from '../i18n/product-dictionary';

import type { Locale } from '@site/core/i18n';

const textLink =
  'inline-flex max-w-full items-center gap-1 text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

export function ProductWholesaleCallout({ locale }: { locale: Locale }) {
  const dictionary = getProductDictionary(locale);
  return (
    <aside className="mt-5 flex min-w-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-xl bg-brand-soft p-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold">{dictionary.wholesaleTitle}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{dictionary.wholesaleText}</p>
      </div>
      <Link
        href={localizedPath(locale, '/wholesale')}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-text underline-offset-4 hover:underline"
      >
        <HandshakeIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
        {dictionary.wholesaleAction}
      </Link>
    </aside>
  );
}

/** Localized links to actual shared policy pages, without duplicating promises. */
export function ProductServiceLinks({ locale }: { locale: Locale }) {
  const dictionary = getProductDictionary(locale);
  const links = [
    { href: '/delivery-and-payment', label: dictionary.deliveryLink, Icon: TruckIcon },
    { href: '/delivery-and-payment', label: dictionary.paymentLink, Icon: WalletIcon },
    { href: '/returns-exchanges', label: dictionary.returns, Icon: ShieldCheckIcon },
  ];
  return (
    <ul className="mt-5 grid gap-1 text-sm">
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <Link
            href={localizedPath(locale, href)}
            className="flex min-h-11 items-center gap-2.5 py-1 underline-offset-4 hover:underline"
          >
            <Icon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
            />
            <span className="min-w-0 flex-1">{label}</span>
            <ChevronRightIcon
              aria-hidden
              className="size-3 shrink-0 text-muted-foreground"
              strokeWidth={1.75}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ProductServiceDetails({ locale }: { locale: Locale }) {
  const dictionary = getProductDictionary(locale);
  return (
    <div className="min-w-0 rounded-xl border border-border bg-card p-5">
      <section
        id="product-delivery"
        aria-labelledby="product-delivery-title"
        className="scroll-mt-36"
      >
        <h2
          id="product-delivery-title"
          className="mb-3 flex items-start gap-2 text-lg leading-tight font-semibold tracking-tight"
        >
          <TruckIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
          {dictionary.deliveryAndPayment}
        </h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          {dictionary.deliveryText}
        </p>
        <Link href={localizedPath(locale, '/delivery-and-payment')} className={`${textLink} mt-3`}>
          {dictionary.deliveryAction}
          <ArrowUpRightIcon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
        </Link>
      </section>
      <section
        id="product-returns"
        aria-labelledby="product-returns-title"
        className="mt-5 scroll-mt-36 border-t border-border pt-5"
      >
        <h2
          id="product-returns-title"
          className="mb-3 flex items-start gap-2 text-base leading-tight font-semibold"
        >
          <ShieldCheckIcon
            aria-hidden
            className="size-5 shrink-0 text-brand-text"
            strokeWidth={1.75}
          />
          {dictionary.returns}
        </h2>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          {dictionary.returnsText}
        </p>
        <Link href={localizedPath(locale, '/returns-exchanges')} className={`${textLink} mt-3`}>
          {dictionary.returnsAction}
          <ArrowUpRightIcon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
        </Link>
      </section>
    </div>
  );
}

export function ProductHelp({ locale }: { locale: Locale }) {
  const dictionary = getProductDictionary(locale);
  return (
    <aside className="mt-8 flex min-w-0 flex-wrap items-center justify-between gap-5 border-t border-border py-6">
      <div className="min-w-0">
        <h2 className="text-xl font-semibold tracking-tight">{dictionary.helpTitle}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{dictionary.helpText}</p>
        <Link href={localizedPath(locale, '/contacts')} className={`${textLink} mt-2`}>
          {dictionary.contactManager}
          <ArrowUpRightIcon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
        </Link>
      </div>
      <a
        href={`tel:${COMPANY.phone.e164}`}
        className="inline-flex min-h-11 items-center gap-2 text-base font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        <PhoneIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
        {COMPANY.phone.display}
      </a>
    </aside>
  );
}
