export type ContentLanguage = 'uk' | 'ru';

export const contentLanguages: readonly ContentLanguage[] = ['uk', 'ru'];

export interface CategoryFaqItem {
  question: string;
  answer: string;
}

/** SEO text and FAQ of one category in one language; empty strings mean "not set". */
export interface CategoryContentDraft {
  seoTitle: string;
  metaDescription: string;
  h1: string;
  bodyHtml: string;
  faq: CategoryFaqItem[];
}

export interface CategoryContent extends CategoryContentDraft {
  language: ContentLanguage;
  updatedAt: string | null;
}

export const emptyCategoryContent = (language: ContentLanguage): CategoryContent => ({
  language,
  seoTitle: '',
  metaDescription: '',
  h1: '',
  bodyHtml: '',
  faq: [],
  updatedAt: null,
});

/** True when a language has no site text at all: the page then shows only the category name. */
export const isCategoryContentEmpty = (content: CategoryContentDraft): boolean =>
  [content.seoTitle, content.metaDescription, content.h1].every((value) => !value.trim()) &&
  (!content.bodyHtml.trim() || content.bodyHtml.trim() === '<p></p>') &&
  content.faq.length === 0;
