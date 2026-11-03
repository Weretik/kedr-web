import { Button } from '@site/shared/ui';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';

import type { WholesaleDictionary } from '@site/content/model';
import type { ReactNode } from 'react';

export function WholesaleAssortment({
  dictionary,
  assortment,
  catalogHref,
  telegram,
}: {
  dictionary: WholesaleDictionary;
  assortment: ReactNode | null;
  catalogHref: string;
  telegram: string;
}) {
  return (
    <section aria-labelledby="wholesale-assortment-title" className="min-w-0 space-y-4">
      <div>
        <h2
          id="wholesale-assortment-title"
          className="text-xl leading-tight font-bold tracking-tight sm:text-2xl"
        >
          {dictionary.assortment.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {dictionary.assortment.intro}
        </p>
      </div>
      {assortment ?? (
        <div className="rounded-xl border border-border bg-muted p-5 sm:p-6">
          <p className="max-w-3xl text-sm leading-relaxed">{dictionary.assortment.unavailable}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              variant="outline"
              className="h-auto min-h-11 w-full py-2.5 whitespace-normal sm:w-auto"
            >
              <Link href={catalogHref}>{dictionary.hero.catalogAction}</Link>
            </Button>
            <Button asChild className="h-auto min-h-11 w-full py-2.5 whitespace-normal sm:w-auto">
              <a href={telegram} target="_blank" rel="noopener noreferrer">
                {dictionary.contact.managerAction}
                <ArrowUpRightIcon aria-hidden strokeWidth={1.75} />
              </a>
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
