import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

import { ContactsCopyPhoneButton } from '../contacts-copy-phone-button';

import type { ContactsDetails, ContactsDictionary } from '@site/content/model';

export function ContactsSales({
  dictionary,
  phone,
}: {
  dictionary: ContactsDictionary;
  phone: ContactsDetails['phone'];
}) {
  return (
    <section
      aria-labelledby="contacts-sales-title"
      className="min-w-0 rounded-xl border border-border bg-card p-5 text-foreground sm:p-6"
    >
      <h2
        id="contacts-sales-title"
        className="flex items-center gap-3 text-xl leading-tight font-bold tracking-tight"
      >
        <PhoneIcon aria-hidden className="size-6 shrink-0 text-brand-text" strokeWidth={1.75} />
        {dictionary.salesTitle}
      </h2>
      <div className="mt-5 flex min-w-0 flex-wrap items-center gap-x-1">
        <a
          href={'tel:' + phone.e164}
          className="inline-flex min-h-11 items-center text-[1.75rem] leading-tight font-bold tracking-tight whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-[2rem] lg:text-[2.125rem]"
        >
          {phone.display}
        </a>
        <ContactsCopyPhoneButton
          e164={phone.e164}
          copyLabel={dictionary.copyLabel}
          copiedLabel={dictionary.copiedLabel}
          fallbackLabel={dictionary.copyFallbackLabel}
        />
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{dictionary.phoneCaption}</p>
      <Button asChild className="mt-5 h-auto min-h-11 w-full py-2.5">
        <a href={'tel:' + phone.e164}>
          <PhoneIcon aria-hidden strokeWidth={1.75} />
          {dictionary.call}
        </a>
      </Button>
    </section>
  );
}
