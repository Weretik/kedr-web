import { seoIssues } from '../entities/seo-review-item';

import type { SeoIssue, SeoReviewItem, SeoReviewKind } from '../entities/seo-review-item';

export interface SeoReviewFilter {
  issue?: SeoIssue;
  kind?: SeoReviewKind;
}

const kindOrder: Record<SeoReviewKind, number> = { category: 0, model: 1, article: 2 };

/** Rows of the chosen kind and issue, ordered by kind, then name, then language (uk first). */
export function filterSeoReview(
  items: readonly SeoReviewItem[],
  filter: SeoReviewFilter,
): SeoReviewItem[] {
  return items
    .filter((item) => !filter.kind || item.kind === filter.kind)
    .filter((item) => !filter.issue || item.issues.includes(filter.issue))
    .sort(
      (a, b) =>
        kindOrder[a.kind] - kindOrder[b.kind] ||
        a.name.localeCompare(b.name, 'uk') ||
        b.language.localeCompare(a.language),
    );
}

/** How many rows of the chosen kind have each issue, for the counters on the filter chips. */
export function countSeoIssues(
  items: readonly SeoReviewItem[],
  kind?: SeoReviewKind,
): Record<SeoIssue, number> {
  const counts = Object.fromEntries(seoIssues.map((issue) => [issue, 0])) as Record<
    SeoIssue,
    number
  >;
  for (const item of items)
    if (!kind || item.kind === kind) for (const issue of item.issues) counts[issue] += 1;
  return counts;
}

/** The admin page where the page's texts are edited. */
export function seoReviewEditPath(item: Pick<SeoReviewItem, 'id' | 'kind'>): string {
  switch (item.kind) {
    case 'article':
      return `/articles/${item.id}`;
    case 'category':
      return `/categories/${item.id}`;
    case 'model':
      return `/site-models/${item.id}`;
  }
}
