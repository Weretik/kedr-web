import { localizedPath } from '@site/core/i18n';
import { Button } from '@site/shared/ui';
import { MailIcon } from 'lucide-react';
import Link from 'next/link';

import type { PrivacyDictionary } from '@site/content/model';

export function PrivacyContact({ dictionary }: { dictionary: PrivacyDictionary }) {
  return (
    <aside
      data-privacy-contact
      aria-labelledby="privacy-help-title"
      className="space-y-4 border-t border-border pt-6 sm:pt-8"
    >
      <div className="flex min-w-0 flex-col gap-5 rounded-xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex min-w-0 items-start gap-4">
          <MailIcon aria-hidden className="mt-1 size-6 shrink-0 text-brand" strokeWidth={1.75} />
          <div className="min-w-0">
            <h2 id="privacy-help-title" className="text-lg font-bold">
              {dictionary.contactTitle}
            </h2>
            <a
              href={'mailto:' + dictionary.contact.email}
              className="mt-2 inline-block max-w-full break-all font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {dictionary.contact.email}
            </a>
          </div>
        </div>
        <Button asChild className="w-full shrink-0 sm:w-auto">
          <a href={'mailto:' + dictionary.contact.email}>{dictionary.contactAction}</a>
        </Button>
      </div>
      <p className="max-w-[75ch] text-sm leading-relaxed text-muted-foreground">
        <span>{dictionary.relatedOffer.heading}: </span>
        <Link
          href={localizedPath(dictionary.locale, '/public-offer')}
          className="font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          {dictionary.relatedOffer.title}
        </Link>
        <span className="block">{dictionary.relatedOffer.description}</span>
      </p>
    </aside>
  );
}
