import { COMPANY } from '@site/core/config';
import { Button } from '@site/shared/ui';
import { PhoneIcon } from 'lucide-react';

import { CopyPhoneButton } from './copy-phone-button';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';

export function SalesContact({ dictionary }: { dictionary: ContactsDictionary }) {
  return (
    <section aria-labelledby="contacts-sales" className="min-w-0 rounded-2xl bg-muted p-5 sm:p-8">
      <h2
        id="contacts-sales"
        className="flex items-center gap-3 text-sm font-semibold tracking-wide text-brand-text uppercase"
      >
        <PhoneIcon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
        {dictionary.sales}
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2">
        <p className="text-[clamp(1.65rem,3vw,2.5rem)] leading-tight font-semibold tracking-tight whitespace-nowrap">
          {COMPANY.phone.display}
        </p>
        <CopyPhoneButton
          phone={COMPANY.phone.e164}
          copyLabel={dictionary.copyLabel}
          copiedLabel={dictionary.copiedLabel}
          errorLabel={dictionary.errorLabel}
        />
      </div>
      <p className="mt-3 text-muted-foreground">{dictionary.salesDescription}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button asChild className="h-12 w-full px-5 sm:w-auto">
          <a href={`tel:${COMPANY.phone.e164}`}>
            <PhoneIcon aria-hidden strokeWidth={1.75} />
            {dictionary.call}
          </a>
        </Button>
        <p className="text-sm text-muted-foreground sm:border-l sm:border-border sm:pl-4">
          {dictionary.callHint}
        </p>
      </div>
    </section>
  );
}
