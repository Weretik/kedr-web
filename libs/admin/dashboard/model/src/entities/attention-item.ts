import type { DashboardCatalog, DashboardContent, DashboardOrders } from './dashboard-overview';

export type AttentionKind =
  | 'sync'
  | 'photos'
  | 'site-no-model'
  | 'site-product-problems'
  | 'site-model-problems'
  | 'site-proposed-models'
  | 'category-texts'
  | 'article-drafts'
  | 'legacy-covers'
  | 'document-drafts';

/** Problem tone: errors block work, warnings hurt the site, notes are unfinished work. */
export type AttentionTone = 'error' | 'warning' | 'note';

export interface AttentionItem {
  kind: AttentionKind;
  tone: AttentionTone;
  title: string;
  detail: string | null;
  href: string;
  actionLabel: string;
}

export interface AttentionSources {
  orders: DashboardOrders | undefined;
  catalog: DashboardCatalog | undefined;
  content: DashboardContent | undefined;
  now: Date;
}
