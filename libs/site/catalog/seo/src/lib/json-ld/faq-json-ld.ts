import type { CategoryFaqItem } from '@site/catalog/model';
import type { JsonLdData } from '@site/core/seo';

/**
 * `FAQPage` for the questions a category shows under its listing (answers stay in the HTML inside `<details>`);
 * `null` when there is no complete question, so nothing is marked up that the page does not show.
 */
export function buildFaqPageJsonLd(faq: readonly CategoryFaqItem[]): JsonLdData | null {
  const items = faq
    .map((item) => ({ question: item.question.trim(), answer: item.answer.trim() }))
    .filter((item) => item.question && item.answer);
  if (!items.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
