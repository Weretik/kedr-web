import { localizedPath } from '@site/core/i18n';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

import type { RequisitesDictionary } from '@site/content/model';

export function RequisitesPayment({ dictionary }: { dictionary: RequisitesDictionary }) {
  return (
    <section
      id="requisites-payment"
      aria-labelledby="requisites-payment-title"
      className="min-w-0 scroll-mt-48 rounded-xl bg-brand-soft p-4 sm:p-6"
    >
      <h2
        id="requisites-payment-title"
        className="flex items-center gap-3 text-xl font-bold tracking-tight sm:text-2xl"
      >
        <InfoIcon aria-hidden className="size-6 shrink-0 text-brand" strokeWidth={1.75} />
        {dictionary.paymentTitle}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed">{dictionary.paymentText}</p>
      <Link
        href={localizedPath(dictionary.locale, '/delivery-and-payment')}
        className="mt-3 inline-block text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
      >
        {dictionary.deliveryLink}
      </Link>
    </section>
  );
}
