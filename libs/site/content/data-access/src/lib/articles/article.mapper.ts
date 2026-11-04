import type { components } from '@shared/api-contracts';
import type { Article } from '@site/content/model';

type ApiArticleSummary = components['schemas']['ArticleSummary'];
type ApiArticle = components['schemas']['Article'];

/**
 * The CDN `coverUrl` when there is one; else a legacy `coverPath`, which is relative to the API, so next/image gets
 * an absolute URL on the API host.
 */
export function coverUrl(
  coverPath: string | null | undefined,
  apiUrl: string,
  cdnUrl?: string | null,
): string | null {
  if (cdnUrl) return cdnUrl;
  return coverPath ? new URL(coverPath, `${apiUrl}/`).href : null;
}

export function mapArticleSummary(item: ApiArticleSummary, apiUrl: string): Article {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    bodyHtml: '',
    image: coverUrl(item.coverPath, apiUrl, item.coverUrl),
    publishedAt: item.publishedOn,
  };
}

export function mapArticle(item: ApiArticle, apiUrl: string): Article {
  return { ...mapArticleSummary(item, apiUrl), bodyHtml: item.bodyHtml };
}
