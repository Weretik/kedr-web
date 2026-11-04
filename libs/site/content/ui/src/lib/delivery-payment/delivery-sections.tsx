import { DocumentHtml } from '../documents/document-html';

import type { LegalDocumentSection } from '@site/content/model';

/** Card-style terms: «Label:» in bold, the rest muted; a numbered list becomes steps across the card. */
const SECTION_HTML_CLASS =
  'text-sm leading-relaxed text-muted-foreground [&_ol]:ml-0 [&_ol]:grid [&_ol]:list-none [&_ol]:gap-6 [&_ol]:[counter-reset:step] sm:[&_ol]:grid-cols-2 lg:[&_ol]:grid-cols-4 [&_ol>li]:ml-0 [&_ol>li]:[counter-increment:step] [&_ol>li]:before:mb-2 [&_ol>li]:before:flex [&_ol>li]:before:size-6 [&_ol>li]:before:items-center [&_ol>li]:before:justify-center [&_ol>li]:before:rounded-full [&_ol>li]:before:border [&_ol>li]:before:border-brand-text [&_ol>li]:before:text-xs [&_ol>li]:before:font-semibold [&_ol>li]:before:text-brand-text [&_ol>li]:before:content-[counter(step)] [&_ol_strong]:block [&_ul]:ml-0 [&_ul]:list-none [&_ul]:divide-y [&_ul]:divide-border [&_ul]:border-t [&_ul]:border-border [&_ul>li]:ml-0 [&_ul>li]:py-4 [&_ul>li:last-child]:pb-0';

/** Every published section as a card; the one with numbered steps spans the full width. */
export function DeliverySections({ sections }: { sections: readonly LegalDocumentSection[] }) {
  return (
    <div className="grid items-start gap-5 lg:grid-cols-2 lg:gap-6">
      {sections.map((section) => {
        const steps = section.html.includes('<ol>');
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-title`}
            data-delivery-section={steps ? 'steps' : 'terms'}
            className={
              steps
                ? 'scroll-mt-40 rounded-xl bg-muted p-5 md:scroll-mt-16 sm:p-6 lg:col-span-2 lg:p-7'
                : 'scroll-mt-40 rounded-xl border border-border bg-card p-5 md:scroll-mt-16 sm:p-6 lg:p-7'
            }
          >
            <h2 id={`${section.id}-title`} className="text-2xl font-bold tracking-tight">
              {section.title}
            </h2>
            <DocumentHtml html={section.html} className={`mt-5 ${SECTION_HTML_CLASS}`} />
          </section>
        );
      })}
    </div>
  );
}
