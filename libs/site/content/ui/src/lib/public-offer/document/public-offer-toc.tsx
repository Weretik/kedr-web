'use client';

import { cn } from '@site/shared/ui';
import { ChevronDownIcon, ListIcon } from 'lucide-react';
import { useRef } from 'react';

import { usePublicOfferSection } from './use-public-offer-section';

export interface PublicOfferTocItem {
  readonly id: string;
  readonly label: string;
}

interface PublicOfferTocProps {
  readonly items: readonly PublicOfferTocItem[];
  readonly label: string;
}

interface ContentsLinksProps extends PublicOfferTocProps {
  readonly currentId: string | null;
}

function ContentsLinks({ items, label, currentId }: ContentsLinksProps) {
  return (
    <nav aria-label={label}>
      <ol className="divide-y divide-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={'#' + item.id}
              aria-current={currentId === item.id ? 'location' : undefined}
              className={cn(
                'block border-l-2 px-4 py-3 text-sm leading-relaxed focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
                currentId === item.id
                  ? 'border-brand bg-brand-soft font-medium text-brand-text'
                  : 'border-transparent hover:bg-muted',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PublicOfferToc({ items, label }: PublicOfferTocProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const currentId = usePublicOfferSection(items, scopeRef);

  return (
    <>
      <div
        ref={scopeRef}
        className="hidden overflow-hidden rounded-xl border border-border bg-card lg:block"
      >
        <h2 className="flex items-center gap-2 p-4 text-base font-semibold">
          <ListIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {label}
        </h2>
        <ContentsLinks items={items} label={label} currentId={currentId} />
      </div>
      <details className="group rounded-xl border border-border bg-muted/60 lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <ListIcon aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
          {label}
          <ChevronDownIcon
            aria-hidden
            className="ml-auto size-4 transition-transform group-open:rotate-180 motion-reduce:transition-none"
            strokeWidth={1.75}
          />
        </summary>
        <ContentsLinks items={items} label={label} currentId={currentId} />
      </details>
    </>
  );
}
