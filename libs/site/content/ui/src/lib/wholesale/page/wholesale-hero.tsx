import { Button } from '@site/shared/ui';
import { ArrowUpRightIcon, HomeIcon, MessageCircleIcon, PhoneIcon, SendIcon } from 'lucide-react';
import Link from 'next/link';

import type { WholesaleCompanyDetails, WholesaleDictionary } from '@site/content/model';

export function WholesaleHero({
  dictionary,
  details,
  homeHref,
  catalogHref,
}: {
  dictionary: WholesaleDictionary;
  details: WholesaleCompanyDetails;
  homeHref: string;
  catalogHref: string;
}) {
  const { hero } = dictionary;

  return (
    <header className="space-y-5">
      <nav aria-label={dictionary.breadcrumbLabel} className="text-sm text-muted-foreground">
        <ol className="flex min-w-0 flex-wrap items-center gap-2">
          <li>
            <Link
              href={homeHref}
              className="inline-flex items-center gap-1.5 rounded-sm hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <HomeIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
              {dictionary.home}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <span aria-current="page" className="text-foreground">
              {dictionary.breadcrumb}
            </span>
          </li>
        </ol>
      </nav>

      <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8">
        <div className="min-w-0">
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
            {hero.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed">{hero.lead}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild className="h-auto min-h-11 w-full py-2.5 whitespace-normal sm:w-auto">
              <a href={details.telegram} target="_blank" rel="noopener noreferrer">
                {hero.conditionsAction}
                <ArrowUpRightIcon aria-hidden strokeWidth={1.75} />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-auto min-h-11 w-full py-2.5 whitespace-normal sm:w-auto"
            >
              <Link href={catalogHref}>{hero.catalogAction}</Link>
            </Button>
          </div>
        </div>

        <aside
          aria-labelledby="wholesale-contact-panel-title"
          className="min-w-0 rounded-xl border border-border bg-card p-5"
        >
          <h2 id="wholesale-contact-panel-title" className="text-lg leading-tight font-bold">
            {hero.contactTitle}
          </h2>
          <a
            href={'tel:' + details.phone.e164}
            className="mt-2 inline-flex min-h-11 max-w-full items-center gap-2 rounded-sm text-xl leading-tight font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            <PhoneIcon aria-hidden className="size-5 shrink-0 text-brand-text" strokeWidth={1.75} />
            <span>{details.phone.display}</span>
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a
              href={details.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <SendIcon
                aria-hidden
                className="size-5 shrink-0 text-brand-text"
                strokeWidth={1.75}
              />
              Telegram
            </a>
            <a
              href={details.viber}
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <MessageCircleIcon
                aria-hidden
                className="size-5 shrink-0 text-brand-text"
                strokeWidth={1.75}
              />
              Viber
            </a>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{hero.contactNote}</p>
        </aside>
      </div>
    </header>
  );
}
