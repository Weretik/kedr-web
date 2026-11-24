import { routerLinkComponents } from '@admin/shared/routing';
import {
  useGetSiteOrderByIdQuery,
  useResendSiteOrderToTelegramMutation,
} from '@admin/site-orders/data-access';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteOrderDetailsPage } from './site-order-details-page';

import type { SiteOrderDetail } from '@admin/site-orders/model';

vi.mock('@admin/site-orders/data-access', () => ({
  useGetSiteOrderByIdQuery: vi.fn(),
  useResendSiteOrderToTelegramMutation: vi.fn(),
}));

const orderId = '3f2b8c1e-7a4d-4e1b-9c2a-1d2e3f4a5b6c';
const failedOrder: SiteOrderDetail = {
  orderId,
  placedAtUtc: '2026-11-24T07:45:00Z',
  firstName: 'Ірина',
  phone: '0671234567',
  total: 409.5,
  telegramStatus: 'failed',
  telegramSentAtUtc: null,
  telegramLastAttemptAtUtc: '2026-11-24T14:45:00Z',
  telegramLastError: 'chat not found',
  items: [{ productId: '27254', title: 'Ручка', unitPrice: 136.5, quantity: 3, amount: 409.5 }],
};
const refetch = vi.fn();

function mockOrder(state: Partial<ReturnType<typeof useGetSiteOrderByIdQuery>>) {
  vi.mocked(useGetSiteOrderByIdQuery).mockReturnValue({
    data: undefined,
    error: undefined,
    isError: false,
    isLoading: false,
    isFetching: false,
    refetch,
    ...state,
  } as ReturnType<typeof useGetSiteOrderByIdQuery>);
}

function mockResend(result: Promise<void>) {
  const trigger = vi.fn(() => ({ unwrap: () => result }));
  vi.mocked(useResendSiteOrderToTelegramMutation).mockReturnValue([
    trigger,
    { isLoading: false },
  ] as unknown as ReturnType<typeof useResendSiteOrderToTelegramMutation>);
  return trigger;
}

function renderPage(path = `/site-orders/${orderId}?page=2&pageSize=20&delivery=problem`) {
  return render(
    <ThemeProvider theme={createTheme({ components: routerLinkComponents })}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<SiteOrderDetailsPage />} path="site-orders/:orderId" />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

describe('SiteOrderDetailsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResend(Promise.resolve());
  });
  afterEach(cleanup);

  it('does not request an id that is not a UUID and keeps the list state in the back link', () => {
    mockOrder({});
    renderPage('/site-orders/123?page=2&pageSize=20&delivery=problem');
    expect(useGetSiteOrderByIdQuery).toHaveBeenCalledWith('123', { skip: true });
    expect(screen.getByText('Замовлення не знайдено.')).toBeTruthy();
    expect(
      screen.getByRole('link', { name: 'Назад до замовлень з сайту' }).getAttribute('href'),
    ).toBe('/site-orders?page=2&pageSize=20&delivery=problem');
    expect(document.activeElement).toBe(
      screen.getByRole('heading', { name: 'Деталі замовлення з сайту' }),
    );
  });

  it('shows not found for an unknown order and a retry for a failed load', () => {
    mockOrder({ error: { status: 404 }, isError: true });
    const { unmount } = renderPage();
    expect(screen.getByText('Замовлення не знайдено.')).toBeTruthy();
    unmount();
    mockOrder({ error: { status: 500 }, isError: true });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(refetch).toHaveBeenCalledOnce();
  });

  it('offers no resend and no edit for a delivered order', () => {
    mockOrder({ data: { ...failedOrder, telegramStatus: 'sent', telegramLastError: null } });
    renderPage();
    expect(screen.queryByRole('button', { name: 'Надіслати в Telegram ще раз' })).toBeNull();
    expect(screen.queryByRole('button', { name: /Редагувати/ })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Ірина' })).toBeTruthy();
  });

  it('resends a failed order and shows the queued notice', async () => {
    mockOrder({ data: failedOrder });
    const trigger = mockResend(Promise.resolve());
    renderPage();
    expect(screen.getByRole('alert').textContent).toContain('chat not found');
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати в Telegram ще раз' }));
    expect(trigger).toHaveBeenCalledWith(orderId);
    await waitFor(() =>
      expect(screen.getByText('Замовлення поставлено в чергу на відправку')).toBeTruthy(),
    );
  });

  it('shows the server detail of a conflict and refreshes the order', async () => {
    mockOrder({ data: failedOrder });
    mockResend(Promise.reject({ status: 409, message: 'Замовлення вже надіслано в Telegram.' }));
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Надіслати в Telegram ще раз' }));
    await waitFor(() =>
      expect(screen.getByText('Замовлення вже надіслано в Telegram.')).toBeTruthy(),
    );
    expect(refetch).toHaveBeenCalledOnce();
  });
});
