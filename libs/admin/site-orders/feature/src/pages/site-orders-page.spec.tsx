import { useGetSiteOrdersPageQuery } from '@admin/site-orders/data-access';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteOrdersPage } from './site-orders-page';

vi.mock('@admin/site-orders/data-access', () => ({ useGetSiteOrdersPageQuery: vi.fn() }));

const orderId = '3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c';

function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname + location.search}</output>;
}

function renderPage(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<SiteOrdersPage />} path="site-orders" />
        <Route element={null} path="site-orders/:orderId" />
      </Routes>
      <Location />
    </MemoryRouter>,
  );
}

describe('SiteOrdersPage', () => {
  beforeEach(() => {
    const page = {
      items: [
        {
          orderId,
          placedAtUtc: '2026-11-24T07:45:00Z',
          firstName: 'Ірина',
          phone: '0671234567',
          lineCount: 30,
          total: 7209,
          telegramStatus: 'sent',
          telegramLastError: null,
        },
      ],
      pageNumber: 2,
      pageSize: 20,
      totalPages: 2,
      totalRecords: 21,
    };
    vi.mocked(useGetSiteOrdersPageQuery).mockReturnValue({
      currentData: page,
      data: page,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof useGetSiteOrdersPageQuery>);
  });
  afterEach(cleanup);

  it('requests the page from the URL and focuses the heading', () => {
    renderPage('/site-orders?page=2&pageSize=20&search=067');
    expect(useGetSiteOrdersPageQuery).toHaveBeenCalledWith({
      page: 2,
      pageSize: 20,
      search: '067',
    });
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Замовлення з сайту' }),
    );
  });

  it('turns on «Лише з проблемою» and resets the page to 1 in the URL', async () => {
    renderPage('/site-orders?page=2&pageSize=20&search=067');
    fireEvent.click(screen.getByRole('switch', { name: 'Лише з проблемою' }));
    await waitFor(() =>
      expect(screen.getByTestId('location').textContent).toBe(
        '/site-orders?page=1&pageSize=20&search=067&delivery=problem',
      ),
    );
  });

  it('opens the detail page and keeps the list state for the way back', () => {
    renderPage('/site-orders?page=2&pageSize=20&delivery=problem');
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути замовлення Ірина' }));
    expect(screen.getByTestId('location').textContent).toBe(
      `/site-orders/${orderId}?page=2&pageSize=20&delivery=problem`,
    );
  });
});
