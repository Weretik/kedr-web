import { articleLanguages, articleLimits } from '../entities/article';

import type { ArticleLanguage } from '../entities/article';
import type { ArticleDraft } from '../forms/article-draft';

export interface ArticleTextErrors {
  title?: string;
  excerpt?: string;
  bodyHtml?: string;
}

export interface ArticleDraftErrors {
  slug?: string;
  publishedOn?: string;
  texts?: Partial<Record<ArticleLanguage, ArticleTextErrors>>;
}

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

/** An editor with only an empty paragraph has no text. */
export const isEmptyHtml = (html: string) => {
  const trimmed = html.trim();
  return !trimmed || trimmed === '<p></p>';
};

const required = (value: string, max: number, missing: string) => {
  const trimmed = value.trim();
  if (!trimmed) return missing;
  return trimmed.length > max ? `Не більше ${max} символів.` : undefined;
};

/**
 * Field errors, or `undefined` when the draft can be saved. A new article may leave the slug empty
 * (`slugRequired: false`): the backend builds it from the Ukrainian title.
 */
export function validateArticleDraft(
  draft: ArticleDraft,
  { slugRequired }: { slugRequired: boolean },
): ArticleDraftErrors | undefined {
  const slug = draft.slug.trim();
  const slugError =
    !slug && !slugRequired
      ? undefined
      : !slug
        ? 'Вкажіть адресу.'
        : slug.length > articleLimits.slug
          ? `Не більше ${articleLimits.slug} символів.`
          : !slugPattern.test(slug)
            ? 'Лише малі латинські літери, цифри та одинарні дефіси.'
            : undefined;

  const texts: Partial<Record<ArticleLanguage, ArticleTextErrors>> = {};
  for (const language of articleLanguages) {
    const text = draft.texts[language];
    const errors: ArticleTextErrors = {
      title: required(text.title, articleLimits.title, 'Вкажіть заголовок.'),
      excerpt: required(text.excerpt, articleLimits.excerpt, 'Вкажіть короткий опис.'),
      bodyHtml: isEmptyHtml(text.bodyHtml)
        ? 'Напишіть текст статті.'
        : text.bodyHtml.length > articleLimits.bodyHtml
          ? 'Текст задовгий. Скоротіть його.'
          : undefined,
    };
    if (Object.values(errors).some(Boolean)) texts[language] = errors;
  }

  const errors: ArticleDraftErrors = {
    slug: slugError,
    publishedOn: datePattern.test(draft.publishedOn) ? undefined : 'Вкажіть дату.',
    texts: Object.keys(texts).length ? texts : undefined,
  };
  return Object.values(errors).some(Boolean) ? errors : undefined;
}
