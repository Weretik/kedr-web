export type ArticleLanguage = 'uk' | 'ru';

export const articleLanguages: readonly ArticleLanguage[] = ['uk', 'ru'];

/** Limits of the Content backend (spec content/001). */
export const articleLimits = {
  slug: 120,
  title: 200,
  excerpt: 300,
  bodyHtml: 50_000,
} as const;

/** One language of an article as the admin edits it; `bodyHtml` comes from the rich text editor. */
export interface ArticleText {
  title: string;
  excerpt: string;
  bodyHtml: string;
}

/** A row of the article list; the title is Ukrainian. */
export interface ArticleSummary {
  id: number;
  slug: string;
  title: string;
  publishedOn: string;
  isPublished: boolean;
  /** Absolute cover URL with the cover version, or `null` without a cover. */
  coverUrl: string | null;
  updatedAt: string;
}

export interface Article {
  id: number;
  slug: string;
  publishedOn: string;
  isPublished: boolean;
  coverUrl: string | null;
  updatedAt: string;
  texts: Record<ArticleLanguage, ArticleText>;
}
