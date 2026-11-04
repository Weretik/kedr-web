import { appConfig } from '@admin/shared/config';

import {
  adminArticleListSchema,
  adminArticleSchema,
  articleCoverUploadSchema,
  legacyArticleCoversMovedSchema,
} from '../validators/articles.schemas';

import type { SaveArticleBody } from '../contracts/admin-articles.contract';
import type {
  Article,
  ArticleCover,
  ArticleDraft,
  ArticleLanguage,
  ArticleSummary,
  ArticleText,
} from '@admin/articles/model';

/**
 * The CDN `coverUrl` when there is one; else a legacy `coverPath`, which is relative to the API (the admin may run
 * on another origin).
 */
export function toCoverUrl(
  coverPath: string | null,
  coverUrl?: string | null,
  apiBaseUrl: string = appConfig.apiBaseUrl,
) {
  if (coverUrl) return coverUrl;
  return coverPath ? `${apiBaseUrl.replace(/\/$/, '')}${coverPath}` : null;
}

export function mapArticleCoverUpload(response: unknown): ArticleCover {
  const { mediaFileId, url } = articleCoverUploadSchema.parse(response);
  return { mediaFileId, url };
}

/** How many legacy covers the move put on the CDN. */
export function mapLegacyCoversMoved(response: unknown): number {
  return legacyArticleCoversMovedSchema.parse(response).moved;
}

export function mapArticleSummaries(response: unknown): ArticleSummary[] {
  return adminArticleListSchema.parse(response).map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    publishedOn: item.publishedOn,
    isPublished: item.isPublished,
    coverUrl: toCoverUrl(item.coverPath, item.coverUrl),
    hasLegacyCover: item.coverPath !== null,
    updatedAt: item.updatedAt,
    updatedBy: item.updatedBy ?? null,
  }));
}

export function mapArticle(response: unknown): Article {
  const dto = adminArticleSchema.parse(response);
  const texts = Object.fromEntries(
    dto.texts.map(({ language, ...text }) => [language, text]),
  ) as Record<ArticleLanguage, ArticleText>;
  return {
    id: dto.id,
    slug: dto.slug,
    publishedOn: dto.publishedOn,
    isPublished: dto.isPublished,
    coverUrl: toCoverUrl(dto.coverPath, dto.coverUrl),
    coverMediaFileId: dto.coverMediaFileId ?? null,
    updatedAt: dto.updatedAt,
    updatedBy: dto.updatedBy ?? null,
    texts,
  };
}

/**
 * A library cover goes as its ID; no cover asks to remove one; a legacy cover the form kept sends neither, so the
 * server leaves it as it is.
 */
export function toSaveArticleBody(draft: ArticleDraft): SaveArticleBody {
  return {
    slug: draft.slug.trim() || null,
    publishedOn: draft.publishedOn,
    isPublished: draft.isPublished,
    removeCover: draft.cover === null,
    ...(draft.cover?.mediaFileId ? { coverMediaFileId: draft.cover.mediaFileId } : {}),
    texts: (['uk', 'ru'] as const).map((language) => ({
      language,
      title: draft.texts[language].title.trim(),
      excerpt: draft.texts[language].excerpt.trim(),
      bodyHtml: draft.texts[language].bodyHtml.trim(),
    })),
  };
}
