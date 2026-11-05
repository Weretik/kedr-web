/** 1C statuses a manager can retry from the order page. */
export type SyncProblemStatus = 'BusinessError' | 'DeadLetter';

export interface SyncProblemOrder {
  orderId: number;
  orderNumber: string;
  counterpartyName: string;
  createdAt: string;
  status: SyncProblemStatus;
  errorMessage: string | null;
}

export interface DashboardOrder {
  orderId: number;
  orderNumber: string;
  counterpartyName: string;
  createdAt: string;
  totalAmount: number;
  /** 1C refused or gave up on the order; the only status the overview marks. */
  hasSyncProblem: boolean;
}

export interface DashboardOrders {
  ordersToday: number;
  draftCount: number;
  syncProblemCount: number;
  /** Newest problems, at most five. */
  syncProblems: readonly SyncProblemOrder[];
  /** Newest orders, at most five. */
  latestOrders: readonly DashboardOrder[];
}

export interface DashboardCatalog {
  productsWithoutPhoto: number;
  topCategoryWithoutPhoto: { id: number; name: string; count: number } | null;
  categoriesWithoutText: number;
  /** Site model health (spec catalog/007); null when the backend does not send it. */
  siteModels: DashboardSiteModels | null;
}

/** Site model problem counts; on-site products outside an accepted model are the hard error. */
export interface DashboardSiteModels {
  productsWithoutModel: number;
  productsWithoutAttributes: number;
  productsMissingAxisValue: number;
  productsWithSameCombination: number;
  modelsWithoutAxes: number;
  modelsWithoutSeo: number;
  modelsWithoutPhoto: number;
  proposedModels: number;
}

export interface DashboardContent {
  articleDrafts: number;
  oldestArticleDraft: { id: number; title: string; updatedAt: string } | null;
  legacyArticleCovers: number;
  documentDrafts: number;
}
