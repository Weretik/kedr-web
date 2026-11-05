import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardPage } from './dashboard-page';

import type { DashboardCatalog, DashboardContent, DashboardOrders } from '@admin/dashboard/model';

const api = vi.hoisted(() => ({ orders: vi.fn(), catalog: vi.fn(), content: vi.fn() }));

vi.mock('@admin/dashboard/data-access', () => ({
  useGetDashboardOrdersQuery: api.orders,
  useGetDashboardCatalogQuery: api.catalog,
  useGetDashboardContentQuery: api.content,
}));

const orders: DashboardOrders = {
  ordersToday: 8,
  draftCount: 3,
  syncProblemCount: 1,
  syncProblems: [
    {
      orderId: 82,
      orderNumber: '10482',
      counterpartyName: 'Іван Мельник',
      createdAt: '2026-11-05T08:51:00Z',
      status: 'BusinessError',
      errorMessage: 'Контрагента не знайдено',
    },
  ],
  latestOrders: [
    {
      orderId: 84,
      orderNumber: '10484',
      counterpartyName: 'ФОП Кравчук',
      createdAt: '2026-11-05T10:12:00Z',
      totalAmount: 12480,
      hasSyncProblem: false,
    },
    {
      orderId: 82,
      orderNumber: '10482',
      counterpartyName: 'Іван Мельник',
      createdAt: '2026-11-05T08:51:00Z',
      totalAmount: 1640,
      hasSyncProblem: true,
    },
  ],
};
const noCatalogProblems: DashboardCatalog = {
  productsWithoutPhoto: 0,
  topCategoryWithoutPhoto: null,
  categoriesWithoutText: 0,
  siteModels: null,
};
const content: DashboardContent = {
  articleDrafts: 0,
  oldestArticleDraft: null,
  legacyArticleCovers: 0,
  documentDrafts: 1,
};

const loaded = <T,>(data: T) => ({ data, isError: false, isLoading: false });
const failed = { data: undefined, isError: true, isLoading: false };

const renderPage = () =>
  render(
    <DashboardPage
      siteRefreshAction={<button type="button">Оновити сайт зараз</button>}
      useViewerName={() => 'Віталій Тюпін'}
    />,
  );

describe('DashboardPage', () => {
  beforeEach(() => {
    api.orders.mockReset().mockReturnValue(loaded(orders));
    api.catalog.mockReset().mockReturnValue(loaded(noCatalogProblems));
    api.content.mockReset().mockReturnValue(loaded(content));
  });

  it('greets the viewer and lists only real problems with links', () => {
    renderPage();

    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/, Віталій$/);
    expect(screen.getByText('1С не прийняла 1 замовлення')).toBeDefined();
    expect(screen.getByText('№ 10482 · Контрагента не знайдено')).toBeDefined();
    expect(screen.getByRole('link', { name: 'Відкрити замовлення' }).getAttribute('href')).toBe(
      '/orders/82',
    );
    expect(screen.getByText('1 чернетка документа')).toBeDefined();
    expect(screen.queryByText(/без фото/)).toBeNull();
    expect(screen.queryByText(/категорі/)).toBeNull();
  });

  it('shows today, the newest orders with a mark only on a 1C problem, and the site action', () => {
    renderPage();

    expect(screen.getByRole('link', { name: 'Замовлень: 8' })).toBeDefined();
    expect(screen.getByRole('link', { name: 'Чернеток: 3' }).getAttribute('href')).toBe(
      '/orders?ordersTab=drafts',
    );
    expect(screen.getByText('ФОП Кравчук')).toBeDefined();
    expect(screen.getAllByText('Не передано')).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Оновити сайт зараз' })).toBeDefined();
    expect(screen.queryByText(/Демо/)).toBeNull();
  });

  it('hides the attention card without problems and names a block that failed', () => {
    api.orders.mockReturnValue(failed);
    api.content.mockReturnValue(loaded({ ...content, documentDrafts: 0 }));
    renderPage();

    expect(screen.queryByText('Потребує уваги')).toBeNull();
    expect(screen.queryByText('Останні замовлення')).toBeNull();
    expect(screen.getByText('Не вдалося завантажити: замовлення. Оновіть сторінку.')).toBeDefined();
  });
});
