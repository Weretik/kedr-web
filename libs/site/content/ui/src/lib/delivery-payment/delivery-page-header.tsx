import { localizedPath } from '@site/core/i18n';
import { ChevronRightIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';

import type { DeliveryPaymentDictionary } from '../i18n/delivery-payment-dictionary';
import type { Locale } from '@site/core/i18n';

export function DeliveryPageHeader({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: DeliveryPaymentDictionary;
}) {
  const title = dictionary['delivery.page.title'];
  const anchors = [
    { id: 'delivery-shipping', label: dictionary['delivery.section.shipping.title'] },
    { id: 'delivery-payment', label: dictionary['delivery.section.payment.title'] },
    { id: 'delivery-order', label: dictionary['delivery.section.order.title'] },
  ];

  return (
    <div>
      <nav aria-label={dictionary.breadcrumbs} className="text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href={localizedPath(locale)}
              aria-label={dictionary.home}
              className="flex items-center rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <HomeIcon aria-hidden className="size-4" strokeWidth={1.75} />
            </Link>
          </li>
          <li className="flex items-center gap-2" aria-current="page">
            <ChevronRightIcon aria-hidden className="size-3.5" strokeWidth={1.75} />
            {title}
          </li>
        </ol>
      </nav>
      <h1 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h1>
      <p className="mt-5 max-w-[75ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
        {dictionary['delivery.section.intro.text']}
      </p>
      <nav
        aria-label={dictionary.sectionNavigation}
        className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium"
      >
        {anchors.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className="rounded-sm text-brand-text underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  );
}
