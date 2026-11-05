import { mapDashboardCatalog, mapDashboardContent, mapDashboardOrders } from './overview.mapper';

describe('overview mappers', () => {
  it('maps orders and marks only retryable 1C statuses', () => {
    const orders = mapDashboardOrders({
      ordersToday: 2,
      draftCount: 1,
      syncProblemCount: 1,
      syncProblems: [
        {
          orderId: 82,
          orderNumber: '10482',
          counterpartyName: 'Іван',
          createdAtUtc: '2026-11-05T08:00:00Z',
          syncStatus: 'BusinessError',
          errorMessage: '  ',
        },
      ],
      latestOrders: [
        {
          orderId: 83,
          orderNumber: '10483',
          counterpartyName: 'ФОП',
          createdAtUtc: '2026-11-05T09:00:00Z',
          totalAmount: 120.5,
          syncStatus: 'Pending',
          lineCount: 1,
          counterpartyId: 'c',
          adjustmentAmount: 0,
        },
        {
          orderId: 82,
          orderNumber: '10482',
          counterpartyName: 'Іван',
          createdAtUtc: '2026-11-05T08:00:00Z',
          totalAmount: 10,
          syncStatus: 'DeadLetter',
          lineCount: 1,
          counterpartyId: 'c',
          adjustmentAmount: 0,
        },
      ],
    });

    expect(orders.syncProblems[0]).toMatchObject({ status: 'BusinessError', errorMessage: null });
    expect(orders.latestOrders.map((order) => order.hasSyncProblem)).toEqual([false, true]);
  });

  it('refuses a response of another shape', () => {
    expect(() => mapDashboardCatalog({ productsWithoutPhoto: 'many' })).toThrow();
    expect(
      mapDashboardContent({
        articleDrafts: 0,
        oldestArticleDraft: null,
        legacyArticleCovers: 0,
        documentDrafts: 0,
      }),
    ).toEqual({
      articleDrafts: 0,
      oldestArticleDraft: null,
      legacyArticleCovers: 0,
      documentDrafts: 0,
    });
  });
});
