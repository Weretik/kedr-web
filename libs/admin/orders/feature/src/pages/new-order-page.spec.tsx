import {
  useCreateWorkspaceDraftMutation,
  useCreateWorkspaceOrderMutation,
} from '@admin/orders/data-access';
import { useGetAllAdminProductsQuery } from '@admin/products/data-access';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { NewOrderPage } from './new-order-page';
import { useOrderQuote } from '../hooks/use-order-quote';
import { clearCurrentOrder, useCurrentOrderSet } from '../state/current-order-set';

vi.mock('@admin/orders/data-access', () => ({
  useCreateWorkspaceOrderMutation: vi.fn(),
  useCreateWorkspaceDraftMutation: vi.fn(),
  getOrderSubmissionConflict: (cause: { conflict?: { code: string; quote?: unknown } }) =>
    cause.conflict?.code === 'quote_changed'
      ? { type: 'quote-changed', quote: cause.conflict.quote }
      : null,
}));
vi.mock('../hooks/use-order-quote', () => ({ useOrderQuote: vi.fn() }));
vi.mock('@admin/products/data-access', () => ({ useGetAllAdminProductsQuery: vi.fn() }));
vi.mock('../state/current-order-set', () => ({
  useCurrentOrderSet: vi.fn(),
  setCurrentOrderLines: vi.fn(),
  clearCurrentOrder: vi.fn(),
  acceptExternalOrderSet: vi.fn(),
  keepCurrentOrderSet: vi.fn(),
}));
vi.mock('../state/current-order-customer', () => ({
  getCurrentOrderCustomer: vi.fn(() => ''),
  setCurrentOrderCustomer: vi.fn(),
}));
vi.mock('@admin/orders/ui', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@admin/orders/ui')>()),
  OrderLineEditor: () => <div>Товари</div>,
}));
const first = {
  counterpartyId: 'C1',
  lines: [{ productId: '7', productName: 'Товар', quantity: 1, unitPrice: 10, lineAmount: 10 }],
  totalAmount: 10,
  quoteFingerprint: 'old',
};
const second = {
  ...first,
  lines: [{ ...first.lines[0], unitPrice: 12, lineAmount: 12 }],
  totalAmount: 12,
  quoteFingerprint: 'new',
};
const create = vi.fn();
describe('checkout server quote confirmation', () => {
  beforeEach(() => {
    vi.mocked(clearCurrentOrder).mockReset();
    vi.mocked(useCurrentOrderSet).mockReturnValue({
      lines: [{ productId: '7', quantity: 1 }],
      warning: null,
    });
    vi.mocked(useOrderQuote).mockReturnValue({
      key: 'C1:7',
      quote: first,
      previewQuote: null,
      loading: false,
      error: false,
      errorMessage: undefined,
    });
    vi.mocked(useGetAllAdminProductsQuery).mockReturnValue({
      data: [],
      isError: false,
    } as unknown as ReturnType<typeof useGetAllAdminProductsQuery>);
    vi.mocked(useCreateWorkspaceOrderMutation).mockReturnValue([
      create,
      { isLoading: false },
    ] as unknown as ReturnType<typeof useCreateWorkspaceOrderMutation>);
    vi.mocked(useCreateWorkspaceDraftMutation).mockReturnValue([
      vi.fn(),
      { isLoading: false },
    ] as unknown as ReturnType<typeof useCreateWorkspaceDraftMutation>);
    create.mockReset();
  });
  it('requires a second confirmation with the recalculated price after 409', async () => {
    create.mockReturnValueOnce({
      unwrap: () =>
        Promise.reject({ status: 409, conflict: { code: 'quote_changed', quote: second } }),
    });
    create.mockReturnValueOnce({
      unwrap: () => Promise.resolve({ orderId: 123, orderNumber: 'SO-123' }),
    });
    render(
      <MemoryRouter initialEntries={['/orders/new?customerId=C1']}>
        <Routes>
          <Route
            path="orders/new"
            element={<NewOrderPage CustomerPicker={({ value }) => <div>Клієнт {value}</div>} />}
          />
          <Route path="orders/:id" element={<div>Оформлено</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Оформити замовлення', { selector: 'button' }));
    expect(screen.getByText(/Підтверджена сума: 10,00/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відправити' }));
    await waitFor(() => expect(screen.getByText(/Ціна змінилася/)).toBeTruthy());
    expect(create).toHaveBeenCalledTimes(1);
    expect(clearCurrentOrder).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Оформити замовлення', { selector: 'button' }));
    expect(screen.getByText(/Підтверджена сума: 12,00/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відправити' }));
    await waitFor(() => expect(create).toHaveBeenCalledTimes(2));
    expect(create.mock.calls[0][0].quoteFingerprint).toBe('old');
    expect(create.mock.calls[1][0].quoteFingerprint).toBe('new');
  });
  it('saves the current lines as a named draft', async () => {
    const save = vi.fn().mockReturnValue({ unwrap: () => Promise.resolve({ draftId: 55 }) });
    vi.mocked(useCreateWorkspaceDraftMutation).mockReturnValue([
      save,
      { isLoading: false },
    ] as unknown as ReturnType<typeof useCreateWorkspaceDraftMutation>);
    render(
      <MemoryRouter initialEntries={['/orders/new?customerId=C1']}>
        <Routes>
          <Route
            path="orders/new"
            element={<NewOrderPage CustomerPicker={({ value }) => <div>Клієнт {value}</div>} />}
          />
          <Route path="orders/drafts/:id" element={<div>Чернетку збережено</div>} />
        </Routes>
      </MemoryRouter>,
    );
    fireEvent.click(screen.getByText('Зберегти як чернетку', { selector: 'button' }));
    const saveButton = screen.getByRole('button', { name: 'Зберегти' });
    expect((saveButton as HTMLButtonElement).disabled).toBe(true);
    fireEvent.change(screen.getByRole('textbox', { name: 'Назва чернетки' }), {
      target: { value: 'Повторне замовлення' },
    });
    expect((saveButton as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(screen.getByRole('button', { name: 'Скасувати' }));
    expect(save).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText('Зберегти як чернетку', { selector: 'button' }));
    expect(
      (screen.getByRole('textbox', { name: 'Назва чернетки' }) as HTMLInputElement).value,
    ).toBe('Повторне замовлення');
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    await waitFor(() =>
      expect(save).toHaveBeenCalledWith(
        expect.objectContaining({
          input: {
            title: 'Повторне замовлення',
            note: null,
            counterpartyId: 'C1',
            lines: [{ productId: '7', quantity: 1 }],
          },
        }),
      ),
    );
    await waitFor(() => expect(screen.getByText('Чернетку збережено')).toBeTruthy());
  });
});
