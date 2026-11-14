import { Button } from '@site/shared/ui';
import { ArrowUpRightIcon, PhoneIcon } from 'lucide-react';
import Link from 'next/link';

import type { WholesaleCompanyDetails, WholesaleDictionary } from '@site/content/model';

export function WholesaleContact({
  dictionary,
  details,
  deliveryHref,
  returnsHref,
}: {
  dictionary: WholesaleDictionary['contact'];
  details: WholesaleCompanyDetails;
  deliveryHref: string;
  returnsHref: string;
}) {
  const textLinkClass =
    'rounded-sm text-sm font-medium text-brand-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring';

  return (
    <section
      aria-labelledby="wholesale-final-contact-title"
      className="grid min-w-0 gap-5 rounded-xl border border-border bg-brand-soft/50 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
    >
      <div className="min-w-0">
        <h2
          id="wholesale-final-contact-title"
          className="text-xl leading-tight font-bold tracking-tight"
        >
          {dictionary.title}
        </h2>
        <a
          href={'tel:' + details.phone.e164}
          className="mt-2 inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-xl leading-tight font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <PhoneIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
          <span>{details.phone.display}</span>
        </a>
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-2">
          <Link href={deliveryHref} className={textLinkClass}>
            {dictionary.deliveryLink}
          </Link>
          <Link href={returnsHref} className={textLinkClass}>
            {dictionary.returnsLink}
          </Link>
        </div>
      </div>
      <Button asChild className="h-auto min-h-11 w-full py-2.5 whitespace-normal lg:w-auto">
        <a href={details.telegram} target="_blank" rel="noopener noreferrer">
          {dictionary.managerAction}
          <ArrowUpRightIcon aria-hidden strokeWidth={1.75} />
        </a>
      </Button>
    </section>
  );
}
