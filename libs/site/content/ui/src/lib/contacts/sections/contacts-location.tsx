import { Button } from '@site/shared/ui';
import { ArrowRightIcon, ArrowUpRightIcon, MapPinIcon } from 'lucide-react';

import type { ContactsDetails, ContactsDictionary } from '@site/content/model';

export function ContactsLocation({
  dictionary,
  details,
}: {
  dictionary: ContactsDictionary;
  details: ContactsDetails;
}) {
  return (
    <section
      id="contacts-location"
      aria-labelledby="contacts-location-title"
      className="grid scroll-mt-44 gap-5 rounded-xl border border-border bg-card p-5 text-foreground sm:p-6 lg:scroll-mt-20 lg:grid-cols-2 lg:items-center lg:gap-7"
    >
      <div>
        <h2
          id="contacts-location-title"
          className="flex items-center gap-3 text-xl leading-tight font-bold tracking-tight"
        >
          <MapPinIcon aria-hidden className="size-6 shrink-0 text-brand-text" strokeWidth={1.75} />
          {dictionary.locationTitle}
        </h2>
        <p className="mt-3 font-medium">{details.city}</p>
        <Button asChild variant="outline" className="mt-4 h-auto min-h-11 w-full py-2.5 sm:w-auto">
          <a href={details.map} target="_blank" rel="noopener noreferrer">
            {dictionary.openMap}
            <ArrowUpRightIcon aria-hidden strokeWidth={1.75} />
          </a>
        </Button>
      </div>
      <div className="border-t border-border pt-5 lg:border-t-0 lg:border-l lg:py-1 lg:pl-7">
        <h3 className="font-semibold">{dictionary.visitTitle}</h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {dictionary.visitText}
        </p>
        <a
          href={'tel:' + details.phone.e164}
          className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {dictionary.contactManager}
          <ArrowRightIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
        </a>
      </div>
    </section>
  );
}
