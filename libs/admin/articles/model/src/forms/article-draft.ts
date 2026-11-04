import { articleLanguages } from '../entities/article';

import type { Article, ArticleLanguage, ArticleText } from '../entities/article';

/** Editable fields of an article; an empty slug on a new article means "build it from the Ukrainian title". */
export interface ArticleDraft {
  slug: string;
  publishedOn: string;
  isPublished: boolean;
  texts: Record<ArticleLanguage, ArticleText>;
}

const emptyText = (): ArticleText => ({ title: '', excerpt: '', bodyHtml: '' });

/** A new article: today's date, not published until the admin turns it on. */
export function newArticleDraft(today: Date = new Date()): ArticleDraft {
  return {
    slug: '',
    publishedOn: today.toISOString().slice(0, 10),
    isPublished: false,
    texts: { uk: emptyText(), ru: emptyText() },
  };
}

export function articleToDraft(article: Article): ArticleDraft {
  return {
    slug: article.slug,
    publishedOn: article.publishedOn,
    isPublished: article.isPublished,
    texts: { uk: { ...article.texts.uk }, ru: { ...article.texts.ru } },
  };
}

/** Whether two drafts differ in what would be saved. */
export function isSameArticleDraft(a: ArticleDraft, b: ArticleDraft): boolean {
  return (
    a.slug === b.slug &&
    a.publishedOn === b.publishedOn &&
    a.isPublished === b.isPublished &&
    articleLanguages.every((language) => {
      const left = a.texts[language];
      const right = b.texts[language];
      return (
        left.title === right.title &&
        left.excerpt === right.excerpt &&
        left.bodyHtml === right.bodyHtml
      );
    })
  );
}
