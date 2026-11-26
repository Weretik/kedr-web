import { seoIssues, seoReviewKinds } from '@admin/seo-review/model';

import { seoReviewListSchema } from '../validators/seo-review.schemas';

import type { SeoIssue, SeoReviewItem, SeoReviewKind } from '@admin/seo-review/model';

const isKind = (kind: string): kind is SeoReviewKind =>
  seoReviewKinds.includes(kind as SeoReviewKind);
const isIssue = (issue: string): issue is SeoIssue => seoIssues.includes(issue as SeoIssue);

/** Keeps pages of known kinds and languages with at least one known issue (spec platform/010 R-05). */
export function mapSeoReview(value: unknown): SeoReviewItem[] {
  return seoReviewListSchema.parse(value).flatMap((item) => {
    const issues = item.issues.filter(isIssue);
    if (!isKind(item.kind) || issues.length === 0) return [];
    if (item.language !== 'uk' && item.language !== 'ru') return [];
    return [{ id: item.id, issues, kind: item.kind, language: item.language, name: item.name }];
  });
}
