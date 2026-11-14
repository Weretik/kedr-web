import { DocumentHtml } from '../../documents/document-html';

import type { LegalDocument } from '@site/content/model';

/** All clauses stay in initial HTML and outside disclosure or client boundaries. */
export function PublicOfferDocument({ document }: { document: LegalDocument }) {
  return (
    <article
      data-offer-document
      aria-label={document.title}
      className="min-w-0 max-w-[75ch] space-y-8 text-base leading-7"
    >
      <DocumentHtml html={document.leadHtml} />
      {document.sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          aria-labelledby={section.id + '-title'}
          className="scroll-mt-48 border-t border-border pt-6 md:scroll-mt-20"
        >
          <h2 id={section.id + '-title'} className="text-xl font-bold tracking-tight sm:text-2xl">
            {section.title}
          </h2>
          <DocumentHtml html={section.html} className="mt-4" />
        </section>
      ))}
    </article>
  );
}
