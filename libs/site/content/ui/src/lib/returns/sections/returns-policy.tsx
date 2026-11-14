import { demoteHeadings } from '@site/content/model';

import { DocumentHtml } from '../../documents/document-html';
import { EditionDate } from '../../documents/edition-date';

import type { LegalDocument } from '@site/content/model';

/** The full published rules under the summary blocks; their headings sit one level below this section. */
export function ReturnsPolicy({ document }: { document: LegalDocument }) {
  return (
    <section
      id="return-full-rules"
      aria-labelledby="return-full-rules-title"
      className="scroll-mt-48 border-t border-border pt-8"
    >
      <h2 id="return-full-rules-title" className="text-xl font-bold tracking-tight sm:text-2xl">
        {document.title}
      </h2>
      <EditionDate
        locale={document.locale}
        effectiveFrom={document.effectiveFrom}
        className="mt-2 text-sm text-muted-foreground"
      />
      <div className="mt-4 max-w-4xl space-y-6 text-sm leading-relaxed text-muted-foreground">
        <DocumentHtml html={document.leadHtml} />
        {document.sections.map((section) => (
          <section key={section.id} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">{section.title}</h3>
            <DocumentHtml html={demoteHeadings(section.html)} className="[&_h4]:text-foreground" />
          </section>
        ))}
      </div>
    </section>
  );
}
