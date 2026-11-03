import { localizedPath } from '@site/core/i18n';
import Link from 'next/link';

import type { DeliveryPaymentDictionary } from '../i18n/delivery-payment-dictionary';
import type { Locale } from '@site/core/i18n';

export function ImportantTerms({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: DeliveryPaymentDictionary;
}) {
  return (
    <section aria-labelledby="delivery-important-title">
      <h2 id="delivery-important-title" className="text-2xl font-bold tracking-tight">
        {dictionary['delivery.section.important.title']}
      </h2>
      <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground marker:text-brand-text">
        <li>{dictionary['delivery.section.important.item1']}</li>
        <li>{dictionary['delivery.section.important.item2']}</li>
      </ul>
      <p className="mt-5 max-w-[75ch] text-sm leading-relaxed text-muted-foreground">
        {dictionary['delivery.section.important.quote.prefix']}
        <Link
          href={localizedPath(locale, '/public-offer')}
          className="rounded-sm text-brand-text underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {dictionary['delivery.section.important.quote.link']}
        </Link>
        {dictionary['delivery.section.important.quote.suffix']}
      </p>
    </section>
  );
}
