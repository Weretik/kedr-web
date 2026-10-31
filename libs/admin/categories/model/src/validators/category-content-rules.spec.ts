import { describe, expect, it } from 'vitest';

import { isSameCategoryContent, validateCategoryContent } from './category-content-rules';
import { emptyCategoryContent } from '../entities/category-content';

const draft = emptyCategoryContent('uk');

describe('validateCategoryContent', () => {
  it('accepts an empty draft', () => {
    expect(validateCategoryContent(draft)).toBeUndefined();
  });

  it('reports fields over their limits', () => {
    const errors = validateCategoryContent({
      ...draft,
      seoTitle: 'a'.repeat(71),
      metaDescription: 'a'.repeat(161),
      h1: 'a'.repeat(121),
    });

    expect(errors?.seoTitle).toBe('Не більше 70 символів.');
    expect(errors?.metaDescription).toBe('Не більше 160 символів.');
    expect(errors?.h1).toBe('Не більше 120 символів.');
  });

  it('requires both parts of an FAQ item and limits the list', () => {
    const errors = validateCategoryContent({
      ...draft,
      faq: [
        { question: 'Питання?', answer: 'Відповідь.' },
        { question: ' ', answer: 'Без питання.' },
        ...Array.from({ length: 19 }, () => ({ question: 'Q', answer: 'A' })),
      ],
    });

    expect(errors?.faq).toBe('Не більше 20 питань.');
    expect(errors?.faqItems?.[0]).toBeUndefined();
    expect(errors?.faqItems?.[1]).toEqual({ question: 'Вкажіть питання.', answer: undefined });
  });
});

describe('isSameCategoryContent', () => {
  it('compares fields and FAQ items', () => {
    const faq = [{ question: 'Q', answer: 'A' }];
    expect(isSameCategoryContent({ ...draft, faq }, { ...draft, faq: [...faq] })).toBe(true);
    expect(
      isSameCategoryContent({ ...draft, faq }, { ...draft, faq: [{ question: 'Q', answer: 'B' }] }),
    ).toBe(false);
  });
});
