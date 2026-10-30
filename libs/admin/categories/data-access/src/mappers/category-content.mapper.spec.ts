import { emptyCategoryContent } from '@admin/categories/model';
import { describe, expect, it } from 'vitest';

import { mapCategoryContent, toSaveCategoryContentBody } from './category-content.mapper';

describe('mapCategoryContent', () => {
  it('fills languages without stored content', () => {
    const content = mapCategoryContent({
      categoryId: 5,
      items: [
        {
          language: 'uk',
          seoTitle: 'Завіси',
          metaDescription: null,
          h1: null,
          bodyHtml: '<p>Текст</p>',
          faq: [{ question: 'Q', answer: 'A' }],
          updatedAt: '2026-10-30T10:00:00Z',
          updatedBy: 'u1',
        },
      ],
    });

    expect(content.uk).toMatchObject({
      seoTitle: 'Завіси',
      metaDescription: '',
      bodyHtml: '<p>Текст</p>',
    });
    expect(content.ru).toEqual(emptyCategoryContent('ru'));
  });
});

describe('toSaveCategoryContentBody', () => {
  it('sends empty fields as null and trims FAQ', () => {
    expect(
      toSaveCategoryContentBody({
        seoTitle: '  ',
        metaDescription: 'Опис ',
        h1: '',
        bodyHtml: '<p></p>',
        faq: [{ question: ' Q ', answer: ' A ' }],
      }),
    ).toEqual({
      seoTitle: null,
      metaDescription: 'Опис',
      h1: null,
      bodyHtml: null,
      faq: [{ question: 'Q', answer: 'A' }],
    });
  });
});
