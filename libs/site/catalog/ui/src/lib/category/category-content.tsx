import { FaqList } from '@site/shared/ui';

import { CategoryText } from './category-text';
import { getCatalogDictionary } from '../i18n/catalog-dictionary';

import type { CategoryContent as CategoryContentModel } from '@site/catalog/model';
import type { Locale } from '@site/core/i18n';

/** Text longer than this (without tags) starts folded, so the listing above stays the focus. */
const FOLD_AFTER_CHARS = 700;

const textLength = (html: string) => html.replace(/<[^>]*>/g, '').trim().length;

/**
 * Admin-written text and FAQ under the listing: one quiet block, text beside the questions on wide screens.
 * `bodyHtml` is sanitized by the backend before it is stored, so it is rendered as is; FAQ answers stay
 * visible in the HTML inside `<details>`.
 */
export function CategoryContent({
  locale,
  content,
}: {
  locale: Locale;
  content: CategoryContentModel;
}) {
  const dictionary = getCatalogDictionary(locale);
  const hasText = Boolean(content.bodyHtml?.trim());
  const hasFaq = content.faq.length > 0;
  if (!hasText && !hasFaq) return null;

  return (
    <section
      aria-label={dictionary.aboutCategory}
      className={
        hasText && hasFaq
          ? 'mt-6 grid gap-8 border-t border-border pt-8 lg:grid-cols-2 lg:gap-12'
          : 'mt-6 grid max-w-3xl gap-8 border-t border-border pt-8'
      }
    >
      {hasText && content.bodyHtml && (
        <CategoryText
          collapsible={textLength(content.bodyHtml) > FOLD_AFTER_CHARS}
          html={content.bodyHtml}
          lessLabel={dictionary.readLess}
          moreLabel={dictionary.readMore}
        />
      )}
      {hasFaq && (
        <div className="min-w-0">
          <h2 className="mb-3 text-lg font-semibold">{dictionary.faqTitle}</h2>
          <FaqList group="category-faq" items={content.faq} />
        </div>
      )}
    </section>
  );
}
