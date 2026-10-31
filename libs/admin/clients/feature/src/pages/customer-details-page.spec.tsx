import { useGetCustomerByIdQuery } from '@admin/clients/data-access';
import { routerLinkComponents } from '@admin/shared/routing';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { fireEvent, render as renderUi, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CustomerDetailsPage } from './customer-details-page';

import type { ReactElement } from 'react';

const linkTheme = createTheme({ components: routerLinkComponents });
const render = (ui: ReactElement) =>
  renderUi(<ThemeProvider theme={linkTheme}>{ui}</ThemeProvider>);

vi.mock('@admin/clients/data-access', () => ({ useGetCustomerByIdQuery: vi.fn() }));

describe('CustomerDetailsPage', () => {
  beforeEach(() => {
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: undefined,
      error: undefined,
      isError: false,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetCustomerByIdQuery>);
  });

  it('does not request an invalid ID and focuses the heading', () => {
    render(
      <MemoryRouter initialEntries={['/customers/%20%20?page=3&pageSize=50']}>
        <Routes>
          <Route
            path="customers/:counterpartyId"
            element={<CustomerDetailsPage renderOrdersPanel={() => null} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(useGetCustomerByIdQuery).toHaveBeenCalledWith('  ', { skip: true });
    expect(screen.getByText('Клієнта не знайдено або посилання недійсне.')).toBeTruthy();
    expect(document.activeElement).toBe(screen.getByRole('heading', { name: 'Деталі клієнта' }));
  });

  it('shows not found and returns to the same list page', () => {
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: undefined,
      error: { status: 404 },
      isError: true,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetCustomerByIdQuery>);

    render(
      <MemoryRouter initialEntries={['/customers/0002?page=3&pageSize=50']}>
        <Routes>
          <Route
            path="customers/:counterpartyId"
            element={<CustomerDetailsPage renderOrdersPanel={() => null} />}
          />
          <Route path="customers" element={<ListLocation />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Клієнта не знайдено або посилання недійсне.')).toBeTruthy();
    const backLink = screen.getByRole('link', { name: 'Назад до клієнтів' });
    expect(backLink.querySelector('svg')).toBeTruthy();
    fireEvent.click(backLink);
    expect(screen.getByText('?page=3&pageSize=50')).toBeTruthy();
  });

  it('injects the orders panel only for the current customer and keeps URL context', () => {
    const customer = {
      counterpartyId: '0002',
      name: 'Бета',
      phone: null,
      email: '',
      defaultPriceTypeId: 5,
      defaultPriceTypeName: 'Роздрібна',
      categoryPriceTypes: [],
    };
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: customer,
      currentData: customer,
      error: undefined,
      isError: false,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetCustomerByIdQuery>);
    const renderOrdersPanel = vi.fn(() => <section aria-label="Замовлення клієнта" />);
    render(
      <MemoryRouter initialEntries={['/customers/0002?orderTab=drafts&draftPage=2']}>
        <Routes>
          <Route
            path="customers/:counterpartyId"
            element={<CustomerDetailsPage renderOrdersPanel={renderOrdersPanel} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('region', { name: 'Замовлення клієнта' })).toBeTruthy();
    expect(renderOrdersPanel).toHaveBeenCalledWith(
      '0002',
      '/customers/0002?orderTab=drafts&draftPage=2',
    );
  });

  it('does not show an order panel for stale customer data', () => {
    const oldCustomer = {
      counterpartyId: '0002',
      name: 'Бета',
      phone: null,
      email: '',
      defaultPriceTypeId: 5,
      defaultPriceTypeName: 'Роздрібна',
      categoryPriceTypes: [],
    };
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: oldCustomer,
      currentData: undefined,
      error: undefined,
      isError: false,
      isLoading: false,
      isFetching: true,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetCustomerByIdQuery>);
    const renderOrdersPanel = vi.fn(() => <section aria-label="Замовлення клієнта" />);
    render(
      <MemoryRouter initialEntries={['/customers/0003']}>
        <Routes>
          <Route
            path="customers/:counterpartyId"
            element={<CustomerDetailsPage renderOrdersPanel={renderOrdersPanel} />}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(renderOrdersPanel).not.toHaveBeenCalled();
    expect(screen.queryByRole('region', { name: 'Замовлення клієнта' })).toBeNull();
  });
  it('keeps the customer name and ID in one detail card beneath a neutral page heading', () => {
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: {
        counterpartyId: '0002',
        name: 'Бета',
        phone: null,
        email: '',
        defaultPriceTypeId: 5,
        defaultPriceTypeName: 'Роздрібна',
        categoryPriceTypes: [],
      },
      error: undefined,
      isError: false,
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    } as ReturnType<typeof useGetCustomerByIdQuery>);

    render(
      <MemoryRouter initialEntries={['/customers/0002']}>
        <Routes>
          <Route
            path="customers/:counterpartyId"
            element={<CustomerDetailsPage renderOrdersPanel={() => null} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Деталі клієнта' })).toBeTruthy();
    expect(screen.getAllByText('Бета')).toHaveLength(1);
    expect(screen.getByRole('article', { name: 'Бета' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Контактні дані' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'Типи цін' })).toBeTruthy();
  });
});

function ListLocation() {
  return <span>{useLocation().search}</span>;
}
