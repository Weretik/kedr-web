import { seoIssues, seoReviewKinds } from '../entities/seo-review-item';

import type { SeoReviewFilter } from './seo-review-filter';
import type { SeoIssue, SeoReviewKind } from '../entities/seo-review-item';

/** Reads `?kind=&issue=` so the filter survives a visit to the editor and back; unknown values are dropped. */
export function parseSeoReviewFilter(search: string): SeoReviewFilter {
  const params = new URLSearchParams(search);
  const kind = params.get('kind') as SeoReviewKind | null;
  const issue = params.get('issue') as SeoIssue | null;
  return {
    ...(kind && seoReviewKinds.includes(kind) && { kind }),
    ...(issue && seoIssues.includes(issue) && { issue }),
  };
}

export function seoReviewFilterSearch(filter: SeoReviewFilter): string {
  const params = new URLSearchParams();
  if (filter.kind) params.set('kind', filter.kind);
  if (filter.issue) params.set('issue', filter.issue);
  return params.toString();
}
