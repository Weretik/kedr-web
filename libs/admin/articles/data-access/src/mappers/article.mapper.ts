import { appConfig } from '@admin/shared/config';

import { adminArticleListSchema, adminArticleSchema } from '../validators/articles.schemas';

import type { SaveArticleBody } from '../contracts/admin-articles.contract';
import type {
  Article,
  ArticleDraft,
  ArticleLanguage,
  ArticleSummary,
  ArticleText,
} from '@admin/articles/model';

/** `coverPath` is relative to the API; the admin may run on another origin. */
export function toCoverUrl(coverPath: string | null, apiBaseUrl: string = appConfig.apiBaseUrl) {
  return coverPath ? `${apiBaseUrl.replace(/\/$/, '')}${coverPath}` : null;
}

export function mapArticleSummaries(response: unknown): ArticleSummary[] {
  return adminArticleListSchema.parse(response).map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    publishedOn: item.publishedOn,
    isPublished: item.isPublished,
    coverUrl: toCoverUrl(item.coverPath),
    updatedAt: item.updatedAt,
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
    coverUrl: toCoverUrl(dto.coverPath),
    updatedAt: dto.updatedAt,
    texts,
  };
}

export function toSaveArticleBody(draft: ArticleDraft): SaveArticleBody {
  return {
    slug: draft.slug.trim() || null,
    publishedOn: draft.publishedOn,
    isPublished: draft.isPublished,
    texts: (['uk', 'ru'] as const).map((language) => ({
      language,
      title: draft.texts[language].title.trim(),
      excerpt: draft.texts[language].excerpt.trim(),
      bodyHtml: draft.texts[language].bodyHtml.trim(),
    })),
  };
}
