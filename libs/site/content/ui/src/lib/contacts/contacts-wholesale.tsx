import { Button } from '@site/shared/ui';
import { ArrowUpRightIcon } from 'lucide-react';

import type { ContactsDictionary } from '@site/content/model';

export function ContactsWholesale({
  dictionary,
  telegram,
}: {
  dictionary: ContactsDictionary;
  telegram: string;
}) {
  return (
    <section
      id="contacts-wholesale"
      aria-labelledby="contacts-wholesale-title"
      className="flex scroll-mt-44 flex-col gap-5 rounded-xl bg-brand-soft p-5 sm:p-6 lg:scroll-mt-20 lg:flex-row lg:items-center lg:justify-between lg:gap-7"
    >
      <div className="min-w-0">
        <h2
          id="contacts-wholesale-title"
          className="text-xl leading-tight font-bold tracking-tight"
        >
          {dictionary.wholesaleTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {dictionary.wholesaleText}
        </p>
      </div>
      <Button asChild className="h-auto min-h-11 w-full py-2.5 lg:w-auto">
        <a href={telegram} target="_blank" rel="noopener noreferrer">
          {dictionary.writeManager}
          <ArrowUpRightIcon aria-hidden strokeWidth={1.75} />
        </a>
      </Button>
    </section>
  );
}
