import { localizedPath } from '@site/core/i18n';
import { Button, cn } from '@site/shared/ui';
import { ArrowUpRightIcon, MailIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

import type { PublicOfferDictionary } from '@site/content/model';
import type { CompanyContacts } from '@site/core/config';

export function PublicOfferContact({
  dictionary,
  contacts,
  className,
}: {
  dictionary: PublicOfferDictionary;
  contacts: Pick<CompanyContacts, 'phone' | 'email'>;
  className?: string;
}) {
  const related = [
    { path: '/delivery-and-payment', label: dictionary.deliveryLink },
    { path: '/returns-exchanges', label: dictionary.returnsLink },
  ];
  return (
    <div data-offer-contact className={cn('min-w-0 space-y-5', className)}>
      <nav aria-label={dictionary.helpTitle} className="grid gap-3 text-sm">
        {related.map((link) => (
          <Link
            key={link.path}
            href={localizedPath(dictionary.locale, link.path)}
            className="flex w-fit items-center gap-1 rounded-sm text-brand-text underline underline-offset-4 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {link.label}
            <ArrowUpRightIcon aria-hidden className="size-3.5 shrink-0" strokeWidth={1.75} />
          </Link>
        ))}
      </nav>
      <section
        aria-label={dictionary.helpTitle}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h2 className="text-lg font-bold tracking-tight">{dictionary.helpTitle}</h2>
        <address className="mt-4 grid gap-3 text-sm not-italic">
          <a
            href={'tel:' + contacts.phone.e164}
            className="flex items-center gap-2 rounded-sm font-semibold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <PhoneIcon aria-hidden className="size-4 shrink-0 text-brand-text" strokeWidth={1.75} />
            {contacts.phone.display}
          </a>
          <a
            href={'mailto:' + contacts.email}
            className="flex items-start gap-2 rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <MailIcon
              aria-hidden
              className="mt-0.5 size-4 shrink-0 text-brand-text"
              strokeWidth={1.75}
            />
            <span className="[overflow-wrap:anywhere]">{contacts.email}</span>
          </a>
        </address>
        <Button asChild className="mt-5 min-h-11 w-full">
          <a href={'tel:' + contacts.phone.e164}>{dictionary.call}</a>
        </Button>
      </section>
    </div>
  );
}
