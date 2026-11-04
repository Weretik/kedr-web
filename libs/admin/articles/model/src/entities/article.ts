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
  /** Absolute cover URL (CDN, or the API for a legacy cover), or `null` without a cover. */
  coverUrl: string | null;
  updatedAt: string;
  /** Who saved last; null for articles saved before this was recorded. */
  updatedBy: string | null;
}

/**
 * The cover as the form holds it: a media library file, or a legacy cover the API still serves
 * (`mediaFileId` null). `url` is null when the library file was deleted.
 */
export interface ArticleCover {
  mediaFileId: number | null;
  url: string | null;
}

export interface Article {
  id: number;
  slug: string;
  publishedOn: string;
  isPublished: boolean;
  coverUrl: string | null;
  /** Media library file of the cover; null without one or for a legacy cover. */
  coverMediaFileId: number | null;
  updatedAt: string;
  updatedBy: string | null;
  texts: Record<ArticleLanguage, ArticleText>;
}
