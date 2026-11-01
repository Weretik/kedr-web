import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CategoryContent as CategoryContentModel } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/**
 * Admin-written text and FAQ under the listing. `bodyHtml` is sanitized by the backend before it is stored, so
 * it is rendered as is; the FAQ stays visible text in `<details>`.
 */
export function CategoryContent({
  locale,
  content,
}: {
  locale: Locale;
  content: CategoryContentModel;
}) {
  const dictionary = getCatalogDictionary(locale);
  if (!content.bodyHtml && !content.faq.length) return null;

  return (
    <section className="grid gap-6 border-t border-border pt-8">
      {content.bodyHtml && (
        <div
          className="max-w-3xl text-sm leading-relaxed text-foreground/90 [&_a]:underline [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:font-semibold [&_li]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
        />
      )}
      {content.faq.length > 0 && (
        <div className="max-w-3xl">
          <h2 className="mb-3 text-lg font-semibold">{dictionary.faqTitle}</h2>
          <div className="divide-y divide-border rounded-xl border border-border">
            {content.faq.map((item) => (
              <details key={item.question} className="group px-4 py-3">
                <summary className="cursor-pointer list-none font-medium marker:hidden">
                  {item.question}
                </summary>
                <p className="mt-2 text-sm whitespace-pre-line text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
