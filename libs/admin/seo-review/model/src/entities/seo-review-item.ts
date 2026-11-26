/** Kinds of site pages the review checks (spec platform/010). */
export type SeoReviewKind = 'article' | 'category' | 'model';

/** Problems the backend reports for a page; titles over 70 and descriptions over 160 characters are long. */
export type SeoIssue =
  'duplicateTitle' | 'longDescription' | 'longTitle' | 'noDescription' | 'noText';

export interface SeoReviewItem {
  id: number;
  issues: readonly SeoIssue[];
  kind: SeoReviewKind;
  language: 'ru' | 'uk';
  name: string;
}

export const seoReviewKinds: readonly SeoReviewKind[] = ['category', 'model', 'article'];

export const seoIssues: readonly SeoIssue[] = [
  'noText',
  'noDescription',
  'longTitle',
  'longDescription',
  'duplicateTitle',
];

export const seoReviewKindLabels: Record<SeoReviewKind, string> = {
  article: 'Стаття',
  category: 'Категорія',
  model: 'Модель',
};

export const seoIssueLabels: Record<SeoIssue, string> = {
  duplicateTitle: 'Однаковий заголовок',
  longDescription: 'Довгий опис',
  longTitle: 'Довгий заголовок',
  noDescription: 'Немає опису',
  noText: 'Немає тексту',
};
