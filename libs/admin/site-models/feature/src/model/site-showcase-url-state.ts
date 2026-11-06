import { isSiteQueueView } from '@admin/site-models/model';

import type { SiteQueueView } from '@admin/site-models/model';

/** The tabs of «Вітрина сайту». */
export type SiteShowcaseTab = 'models' | 'attributes' | 'codes' | 'filters';

export const siteShowcaseTabs: readonly SiteShowcaseTab[] = [
  'models',
  'attributes',
  'codes',
  'filters',
];

/** The «Моделі» queue as the address keeps it, so «Огляд» and old links open the right place. */
export interface SiteQueueState {
  view: SiteQueueView;
  categoryId?: number;
  search?: string;
  /** The open row: `m{modelId}` or `p{productId}`. */
  item?: string;
}

function readPositive(value: string | null): number | undefined {
  const number = Number(value);
  return value !== null && Number.isInteger(number) && number > 0 ? number : undefined;
}

export function readSiteShowcaseTab(params: URLSearchParams): SiteShowcaseTab {
  const tab = params.get('tab');
  return siteShowcaseTabs.find((item) => item === tab) ?? 'models';
}

/** Reads the queue; the filters of the old pages (`problem`, `status`) still pick a view. */
export function readSiteQueueState(params: URLSearchParams): SiteQueueState {
  const view = params.get('view');
  const item = params.get('item');
  return {
    view: isSiteQueueView(view) ? view : legacyView(params),
    categoryId: readPositive(params.get('categoryId')),
    search: params.get('search')?.trim() || undefined,
    item: item && /^[mp]\d+$/u.test(item) ? item : undefined,
  };
}

function legacyView(params: URLSearchParams): SiteQueueView {
  const problem = params.get('problem');
  if (problem === 'no_model') return 'lone';
  if (params.get('status') === 'proposed') return 'review';
  if (problem) return 'problems';
  return 'review';
}

/** The address of the queue state: only what differs from the default. */
export function writeSiteQueueState(state: SiteQueueState): URLSearchParams {
  const params = new URLSearchParams();
  if (state.view !== 'review') params.set('view', state.view);
  if (state.categoryId) params.set('categoryId', String(state.categoryId));
  if (state.search) params.set('search', state.search);
  if (state.item) params.set('item', state.item);
  return params;
}

/** Where an old «Моделі», model card, or «Ознаки» address goes now. */
export function legacySiteShowcasePath(
  page: 'models' | 'model' | 'attributes',
  params: URLSearchParams,
  modelId?: string,
): string {
  if (page === 'attributes') {
    const tab = params.get('tab');
    return `/site-showcase?tab=${tab === 'codes' || tab === 'filters' ? tab : 'attributes'}`;
  }
  const id = readPositive(modelId ?? null);
  const state: SiteQueueState =
    page === 'model' && id ? { view: 'all', item: `m${id}` } : readSiteQueueState(params);
  const search = writeSiteQueueState(state).toString();
  return search ? `/site-showcase?${search}` : '/site-showcase';
}
