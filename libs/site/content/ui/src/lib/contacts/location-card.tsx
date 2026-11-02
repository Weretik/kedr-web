import { COMPANY } from '@site/core/config';
import { Button } from '@site/shared/ui';
import { ArrowUpRightIcon, MapPinIcon } from 'lucide-react';

import type { ContactsDictionary } from '../i18n/contacts-dictionary';
import type { Locale } from '@site/core/i18n';

export function LocationCard({
  locale,
  dictionary,
}: {
  locale: Locale;
  dictionary: ContactsDictionary;
}) {
  return (
    <section
      aria-labelledby="contacts-location"
      className="min-w-0 rounded-2xl border border-border bg-background p-5 sm:p-8"
    >
      <div className="flex h-full gap-5">
        <div className="min-w-0 flex-1">
          <h2
            id="contacts-location"
            className="flex items-center gap-3 text-xl font-semibold tracking-tight sm:text-2xl"
          >
            <MapPinIcon
              aria-hidden
              className="size-6 shrink-0 text-brand-text"
              strokeWidth={1.75}
            />
            {dictionary.locationHeading}
          </h2>
          <address className="mt-5 text-lg font-semibold not-italic">
            {dictionary.cityPrefix} {COMPANY.address.city[locale]}
          </address>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {dictionary.visitHint}
          </p>
          <Button asChild variant="outline" className="mt-6 h-11 w-full px-3 sm:w-auto">
            <a href={COMPANY.links.map} target="_blank" rel="noopener noreferrer">
              {dictionary.map}
              <ArrowUpRightIcon aria-hidden strokeWidth={1.75} />
            </a>
          </Button>
        </div>
        <div
          aria-hidden
          className="hidden w-28 shrink-0 flex-col items-center justify-center gap-3 rounded-xl bg-muted p-4 text-muted-foreground sm:flex xl:w-36"
        >
          <MapPinIcon className="size-12" strokeWidth={1.75} />
          <span className="text-sm font-medium">{COMPANY.address.city[locale]}</span>
        </div>
      </div>
    </section>
  );
}
