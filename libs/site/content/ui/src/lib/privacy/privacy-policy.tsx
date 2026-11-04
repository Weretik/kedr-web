import { DocumentHtml } from '../documents/document-html';

import type { LegalDocument } from '@site/content/model';

export function PrivacyPolicy({ title, document }: { title: string; document: LegalDocument }) {
  return (
    <article
      data-privacy-document
      aria-label={title}
      className="min-w-0 max-w-[75ch] space-y-8 text-base leading-relaxed"
    >
      <DocumentHtml html={document.leadHtml} />
      {document.sections.map((section, index) => (
        <section
          key={section.id}
          aria-labelledby={section.id}
          className={index === 0 ? undefined : 'border-t border-border pt-8'}
        >
          <h2
            id={section.id}
            data-privacy-heading
            tabIndex={-1}
            className="scroll-mt-48 break-words text-lg font-bold leading-snug tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring sm:text-xl"
          >
            {section.title}
          </h2>
          <DocumentHtml html={section.html} className="mt-4" />
        </section>
      ))}
    </article>
  );
}
