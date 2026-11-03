import { CreditCardIcon, TruckIcon } from 'lucide-react';

import type { DeliveryPaymentDictionary } from '../i18n/delivery-payment-dictionary';

export function DeliveryPaymentTerms({ dictionary }: { dictionary: DeliveryPaymentDictionary }) {
  const panels = [
    {
      id: 'delivery-shipping',
      title: dictionary['delivery.section.shipping.title'],
      lead: dictionary['delivery.section.shipping.text'],
      Icon: TruckIcon,
      terms: [
        dictionary['delivery.section.shipping.item1'],
        dictionary['delivery.section.shipping.item2'],
        dictionary['delivery.section.shipping.item3'],
        dictionary['delivery.section.shipping.item4'],
        dictionary['delivery.section.shipping.item5'],
      ],
    },
    {
      id: 'delivery-payment',
      title: dictionary['delivery.section.payment.title'],
      lead: dictionary['delivery.section.payment.text'],
      Icon: CreditCardIcon,
      terms: [
        dictionary['delivery.section.payment.item1'],
        dictionary['delivery.section.payment.item2'],
        dictionary['delivery.section.payment.item3'],
      ],
    },
  ];

  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
      {panels.map(({ id, title, lead, Icon, terms }) => (
        <section
          key={id}
          id={id}
          aria-labelledby={`${id}-title`}
          className="scroll-mt-40 rounded-xl border border-border bg-card p-5 md:scroll-mt-16 sm:p-6 lg:p-7"
        >
          <h2
            id={`${id}-title`}
            className="flex items-center gap-3 text-2xl font-bold tracking-tight"
          >
            <Icon aria-hidden className="size-7 shrink-0 text-brand-text" strokeWidth={1.75} />
            {title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{lead}</p>
          <ul className="mt-5 divide-y divide-border border-t border-border">
            {terms.map((term) => {
              const colon = term.indexOf(':');
              return (
                <li
                  key={term}
                  className="py-4 text-sm leading-relaxed last:pb-0 sm:grid sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-x-4"
                >
                  <strong className="font-semibold">{term.slice(0, colon + 1)}</strong>{' '}
                  <span className="text-muted-foreground">{term.slice(colon + 1).trim()}</span>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
