import { useGetCustomerByIdQuery, useGetCustomersPageQuery } from '@admin/clients/data-access';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CustomerPicker } from './customer-picker';

vi.mock('@admin/clients/data-access', () => ({
  useGetCustomerByIdQuery: vi.fn(),
  useGetCustomersPageQuery: vi.fn(),
}));

const makeCustomer = (counterpartyId: string, name: string) => ({
  counterpartyId,
  name,
  phone: null,
});

const firstPage = {
  items: [makeCustomer('C1', 'Перший клієнт')],
  pageNumber: 1,
  pageSize: 20,
  totalPages: 2,
  totalRecords: 21,
};
const secondPage = {
  items: [makeCustomer('C21', 'Пізній клієнт')],
  pageNumber: 2,
  pageSize: 20,
  totalPages: 2,
  totalRecords: 21,
};
const emptyPage = {
  items: [],
  pageNumber: 1,
  pageSize: 20,
  totalPages: 0,
  totalRecords: 0,
};

describe('CustomerPicker', () => {
  beforeEach(() => {
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: undefined,
      isFetching: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetCustomerByIdQuery>);
    vi.mocked(useGetCustomersPageQuery).mockImplementation(
      (args) =>
        ({
          data: typeof args === 'object' && args.page === 1 ? firstPage : secondPage,
          isFetching: false,
          isError: false,
        }) as unknown as ReturnType<typeof useGetCustomersPageQuery>,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('loads later pages on scroll and returns the selected stable id with its name only', async () => {
    const onChange = vi.fn();
    render(<CustomerPicker value="" label="Клієнт" onChange={onChange} />);
    const input = screen.getByRole('combobox', { name: 'Клієнт' });
    await userEvent.click(input);

    expect(await screen.findByText('Перший клієнт')).toBeInTheDocument();
    expect(screen.queryByText(/C1/)).not.toBeInTheDocument();

    const listbox = screen.getByRole('listbox');
    Object.defineProperties(listbox, {
      scrollTop: { configurable: true, writable: true, value: 100 },
      clientHeight: { configurable: true, writable: true, value: 100 },
      scrollHeight: { configurable: true, writable: true, value: 200 },
    });
    fireEvent.scroll(listbox);

    expect(await screen.findByText('Пізній клієнт')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Пізній клієнт'));
    expect(onChange).toHaveBeenCalledWith('C21', 'Пізній клієнт');
    expect(screen.queryByText(/C21/)).not.toBeInTheDocument();
  });

  it('keeps a selected customer visible when it is outside the loaded page and exposes load errors', async () => {
    vi.mocked(useGetCustomerByIdQuery).mockReturnValue({
      data: selectedCustomer,
      isFetching: false,
      isError: false,
    } as unknown as ReturnType<typeof useGetCustomerByIdQuery>);
    vi.mocked(useGetCustomersPageQuery).mockReturnValue({
      data: emptyPage,
      isFetching: false,
      isError: true,
    } as unknown as ReturnType<typeof useGetCustomersPageQuery>);

    render(<CustomerPicker value="C99" label="Клієнт" onChange={vi.fn()} />);
    expect(screen.getByRole('combobox', { name: 'Клієнт' })).toHaveValue('Вибраний клієнт');
    expect(screen.getByText('Не вдалося завантажити клієнтів.')).toBeInTheDocument();
  });
});

const selectedCustomer = makeCustomer('C99', 'Вибраний клієнт');
