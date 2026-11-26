import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteModelAddProductsPanel } from './site-model-add-products-panel';

const api = vi.hoisted(() => ({ add: vi.fn(), showcase: vi.fn() }));

const product = (productId: number, categoryName: string, model: unknown) => ({
  productId,
  name: `Товар ${productId}`,
  photo: '',
  categoryName,
  model,
});

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelQuery: () => ({
    data: { id: 5, name: 'Ручка Рим', categoryName: 'Ручки', products: [{ productId: 10 }] },
  }),
  useGetSiteShowcaseQuery: api.showcase,
  useAddSiteModelProductsMutation: () => [api.add, { isLoading: false }],
}));

describe('SiteModelAddProductsPanel', () => {
  beforeEach(() => {
    api.add.mockReset();
    api.showcase.mockReturnValue({
      data: {
        items: [
          { products: [product(13, 'Ручки', { id: 9, name: 'Мілан', status: 'accepted' })] },
          { products: [product(10, 'Ручки', null), product(12, 'Накладки', null)] },
        ],
      },
      isFetching: false,
    });
  });

  it('lists free products first and adds one of another 1C category (SC-006)', async () => {
    api.add.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    const onClose = vi.fn();
    const onNotice = vi.fn();
    render(<SiteModelAddProductsPanel modelId={5} onClose={onClose} onNotice={onNotice} open />);
    expect(api.showcase).toHaveBeenLastCalledWith({ status: 'none', page: 1, pageSize: 50 });
    const names = screen.getAllByRole('checkbox').map((box) => box.getAttribute('aria-label'));
    expect(names).toEqual(['Товар 12', 'Товар 13']);
    expect(screen.getByText('Код 1С 13 · Ручки · Уже в моделі «Мілан»')).toBeTruthy();
    fireEvent.click(screen.getByText('Товар 12'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати (1)' }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(api.add).toHaveBeenCalledWith({ id: 5, productIds: [12] });
    expect(onNotice).toHaveBeenCalledWith('Товари додано');
  });

  it('shows a refusal of the server', async () => {
    api.add.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          status: 400,
          fieldErrors: { productIds: ['Product is already in another model.'] },
        }),
    });
    render(<SiteModelAddProductsPanel modelId={5} onClose={vi.fn()} onNotice={vi.fn()} open />);
    fireEvent.click(screen.getByText('Товар 12'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати (1)' }));
    expect(
      await screen.findByText('Товар уже в іншій прийнятій моделі: спершу приберіть його звідти.'),
    ).toBeTruthy();
  });
});
