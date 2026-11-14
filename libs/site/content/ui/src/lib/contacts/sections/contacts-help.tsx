import { localizedPath } from '@site/core/i18n';
import { TruckIcon, Undo2Icon } from 'lucide-react';
import Link from 'next/link';

import type { ContactsDictionary } from '@site/content/model';

const textLinkClass =
  'inline-flex min-h-11 items-center gap-2 text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

export function ContactsHelp({ dictionary }: { dictionary: ContactsDictionary }) {
  return (
    <section
      aria-labelledby="contacts-preparation-title"
      className="grid items-start gap-4 lg:grid-cols-2 lg:gap-9"
    >
      <div>
        <h2 id="contacts-preparation-title" className="text-lg font-bold tracking-tight">
          {dictionary.prepareTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {dictionary.prepareText}
        </p>
      </div>
      <nav aria-label={dictionary.helpLabel} className="grid justify-items-start gap-1">
        <Link
          href={localizedPath(dictionary.locale, '/delivery-and-payment')}
          className={textLinkClass}
        >
          <TruckIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {dictionary.deliveryLink}
        </Link>
        <Link
          href={localizedPath(dictionary.locale, '/returns-exchanges')}
          className={textLinkClass}
        >
          <Undo2Icon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {dictionary.returnsLink}
        </Link>
      </nav>
    </section>
  );
}
