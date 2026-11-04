import { cn } from '@site/shared/ui';
import { ChevronDownIcon, ListIcon } from 'lucide-react';

import styles from './privacy-content.module.css';

import type { LegalDocumentSection, PrivacyDictionary } from '@site/content/model';

function ContentsLinks({ sections }: { sections: readonly LegalDocumentSection[] }) {
  return (
    <ol className="space-y-1">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={'#' + section.id}
            data-first={index === 0 ? 'true' : undefined}
            className={cn(
              styles.contentsLink,
              'flex min-h-10 items-start gap-2 rounded-md px-2 py-2 text-sm leading-relaxed hover:bg-muted hover:text-brand-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
            )}
          >
            <span>{section.title}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

export function PrivacyNavigation({
  dictionary,
  sections,
  variant,
}: {
  dictionary: PrivacyDictionary;
  sections: readonly LegalDocumentSection[];
  variant: 'desktop' | 'mobile';
}) {
  if (variant === 'mobile') {
    return (
      <details data-privacy-contents="mobile" className="group rounded-lg border border-border">
        <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
          <ListIcon aria-hidden className="size-5 shrink-0" strokeWidth={1.75} />
          <span className="min-w-0 flex-1">{dictionary.contentsLabel}</span>
          <ChevronDownIcon
            aria-hidden
            className="size-4 shrink-0 group-open:rotate-180"
            strokeWidth={1.75}
          />
        </summary>
        <nav aria-label={dictionary.contentsLabel} className="border-t border-border p-2">
          <ContentsLinks sections={sections} />
        </nav>
      </details>
    );
  }

  return (
    <nav
      data-privacy-contents="desktop"
      aria-label={dictionary.contentsLabel}
      className="max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-xl border border-border p-3"
    >
      <h2 className="px-2 pb-3 pt-1 font-bold">{dictionary.contentsLabel}</h2>
      <ContentsLinks sections={sections} />
    </nav>
  );
}
