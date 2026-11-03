import { ChevronRightIcon } from 'lucide-react';

import type { DeliveryPaymentDictionary } from '../i18n/delivery-payment-dictionary';

export function OrderSteps({ dictionary }: { dictionary: DeliveryPaymentDictionary }) {
  const steps = [
    dictionary['delivery.section.order.item1'],
    dictionary['delivery.section.order.item2'],
    dictionary['delivery.section.order.item3'],
    dictionary['delivery.section.order.item4'],
  ];

  return (
    <section
      id="delivery-order"
      aria-labelledby="delivery-order-title"
      className="scroll-mt-40 rounded-xl bg-muted p-5 md:scroll-mt-16 sm:p-6 lg:p-7"
    >
      <h2 id="delivery-order-title" className="text-2xl font-bold tracking-tight">
        {dictionary['delivery.section.order.title']}
      </h2>
      <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, index) => {
          const colon = step.indexOf(':');
          return (
            <li key={step} className="relative">
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden
                  className="flex size-6 shrink-0 items-center justify-center rounded-full border border-brand-text text-xs font-semibold text-brand-text"
                >
                  {index + 1}
                </span>
                <h3 className="text-sm font-semibold">{step.slice(0, colon + 1)}</h3>
              </div>{' '}
              <p className="mt-2 pl-8.5 text-sm leading-relaxed text-muted-foreground sm:pl-0">
                {step.slice(colon + 1).trim()}
              </p>
              {index < steps.length - 1 && (
                <ChevronRightIcon
                  aria-hidden
                  className="absolute top-0.5 -right-5 hidden size-5 text-muted-foreground lg:block"
                  strokeWidth={1.75}
                />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
