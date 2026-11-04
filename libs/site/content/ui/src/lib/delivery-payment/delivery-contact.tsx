import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

import type { DeliveryPaymentDictionary } from '../i18n/delivery-payment-dictionary';
import type { CompanyContacts } from '@site/core/config';

export function DeliveryContact({
  dictionary,
  phone,
}: {
  dictionary: DeliveryPaymentDictionary;
  phone: CompanyContacts['phone'];
}) {
  return (
    <aside
      aria-labelledby="delivery-contact-title"
      className="rounded-xl border border-border bg-card p-5 sm:p-6"
    >
      <h2 id="delivery-contact-title" className="text-xl font-bold tracking-tight">
        {dictionary.question}
      </h2>
      <p className="mt-4 flex items-center gap-2 text-lg font-semibold">
        <PhoneIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
        {phone.display}
      </p>
      <Button asChild className="mt-5 min-h-11 w-full">
        <a href={`tel:${phone.e164}`}>{dictionary.call}</a>
      </Button>
    </aside>
  );
}
