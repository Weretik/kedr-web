/** The tabs of «Перевірка» (spec admin/site-models/001, R-007). */
export type SiteReviewTab = 'new' | 'lone' | 'codes';

export const siteReviewTabs: readonly SiteReviewTab[] = ['new', 'lone', 'codes'];

/** The «Нові моделі» queue as the address keeps it. */
export interface SiteQueueState {
  categoryId?: number;
  search?: string;
  /** The open proposal: `m{modelId}`. */
  item?: string;
}

function readPositive(value: string | null): number | undefined {
  const number = Number(value);
  return value !== null && Number.isInteger(number) && number > 0 ? number : undefined;
}

export function readSiteReviewTab(params: URLSearchParams): SiteReviewTab {
  const tab = params.get('tab');
  return siteReviewTabs.find((item) => item === tab) ?? 'new';
}

export function readSiteQueueState(params: URLSearchParams): SiteQueueState {
  const item = params.get('item');
  return {
    categoryId: readPositive(params.get('categoryId')),
    search: params.get('search')?.trim() || undefined,
    item: item && /^m\d+$/u.test(item) ? item : undefined,
  };
}

/** The address of a tab, with the queue values that are set. */
export function writeSiteReviewState(
  tab: SiteReviewTab,
  queue: SiteQueueState = {},
): URLSearchParams {
  const params = new URLSearchParams({ tab });
  if (queue.categoryId) params.set('categoryId', String(queue.categoryId));
  if (queue.search) params.set('search', queue.search);
  if (queue.item) params.set('item', queue.item);
  return params;
}
