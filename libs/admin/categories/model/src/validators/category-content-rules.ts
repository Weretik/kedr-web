import type { CategoryContentDraft } from '../entities/category-content';

/** Limits of the catalog backend (spec 005). */
export const categoryContentLimits = {
  seoTitle: 70,
  metaDescription: 160,
  h1: 120,
  bodyHtml: 20000,
  faqItems: 20,
  faqQuestion: 200,
  faqAnswer: 2000,
} as const;

export interface CategoryContentErrors {
  seoTitle?: string;
  metaDescription?: string;
  h1?: string;
  bodyHtml?: string;
  faq?: string;
  /** Per FAQ item, by position. */
  faqItems?: Array<{ question?: string; answer?: string } | undefined>;
}

const tooLong = (value: string, max: number) =>
  value.trim().length > max ? `Не більше ${max} символів.` : undefined;

/** Returns field errors, or `undefined` when the draft can be saved. */
export function validateCategoryContent(
  draft: CategoryContentDraft,
): CategoryContentErrors | undefined {
  const limits = categoryContentLimits;
  const faqItems = draft.faq.map((item) => {
    const question = item.question.trim()
      ? tooLong(item.question, limits.faqQuestion)
      : 'Вкажіть питання.';
    const answer = item.answer.trim()
      ? tooLong(item.answer, limits.faqAnswer)
      : 'Вкажіть відповідь.';
    return question || answer ? { question, answer } : undefined;
  });

  const errors: CategoryContentErrors = {
    seoTitle: tooLong(draft.seoTitle, limits.seoTitle),
    metaDescription: tooLong(draft.metaDescription, limits.metaDescription),
    h1: tooLong(draft.h1, limits.h1),
    bodyHtml:
      draft.bodyHtml.length > limits.bodyHtml ? 'Текст задовгий. Скоротіть його.' : undefined,
    faq: draft.faq.length > limits.faqItems ? `Не більше ${limits.faqItems} питань.` : undefined,
    faqItems: faqItems.some(Boolean) ? faqItems : undefined,
  };

  return Object.values(errors).some(Boolean) ? errors : undefined;
}

/** Whether two drafts differ in what would be saved. */
export function isSameCategoryContent(a: CategoryContentDraft, b: CategoryContentDraft): boolean {
  return (
    a.seoTitle === b.seoTitle &&
    a.metaDescription === b.metaDescription &&
    a.h1 === b.h1 &&
    a.bodyHtml === b.bodyHtml &&
    a.faq.length === b.faq.length &&
    a.faq.every(
      (item, index) =>
        item.question === b.faq[index]?.question && item.answer === b.faq[index]?.answer,
    )
  );
}
