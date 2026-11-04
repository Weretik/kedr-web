import type { components } from '@shared/api-contracts';
import type { Article } from '@site/content/model';

type ApiArticleSummary = components['schemas']['ArticleSummary'];
type ApiArticle = components['schemas']['Article'];

/** `coverPath` is relative to the API; the site and next/image need an absolute URL on the API host. */
export function coverUrl(coverPath: string | null | undefined, apiUrl: string): string | null {
  return coverPath ? new URL(coverPath, `${apiUrl}/`).href : null;
}

export function mapArticleSummary(item: ApiArticleSummary, apiUrl: string): Article {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    bodyHtml: '',
    image: coverUrl(item.coverPath, apiUrl),
    publishedAt: item.publishedOn,
  };
}

export function mapArticle(item: ApiArticle, apiUrl: string): Article {
  return { ...mapArticleSummary(item, apiUrl), bodyHtml: item.bodyHtml };
}
