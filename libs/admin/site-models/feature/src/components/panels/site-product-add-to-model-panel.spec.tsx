import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteProductAddToModelPanel } from './site-product-add-to-model-panel';

const api = vi.hoisted(() => ({ add: vi.fn(), list: vi.fn() }));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelsQuery: api.list,
  useAddSiteModelProductsMutation: () => [api.add, { isLoading: false }],
}));

describe('SiteProductAddToModelPanel', () => {
  beforeEach(() => {
    api.add.mockReset();
    api.list.mockReturnValue({
      data: {
        items: [{ id: 5, name: 'Ручка Рим', categoryName: 'Ручки', status: 'accepted' }],
      },
      isFetching: false,
    });
  });

  it('searches models and adds the product to the picked one', async () => {
    api.add.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    const onClose = vi.fn();
    render(
      <SiteProductAddToModelPanel
        onClose={onClose}
        onNewModel={vi.fn()}
        onNotice={vi.fn()}
        open
        productId={11}
      />,
    );
    expect(screen.getByText('Товар · Код 1С 11')).toBeTruthy();
    const input = screen.getByRole('combobox', { name: 'Модель' });
    fireEvent.change(input, { target: { value: 'Рим' } });
    expect(api.list).toHaveBeenCalledWith({ search: 'Рим', page: 1, pageSize: 20 });
    fireEvent.click(screen.getByText('Ручка Рим'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(api.add).toHaveBeenCalledWith({ id: 5, productIds: [11] });
  });

  it('offers a new model instead', () => {
    const onNewModel = vi.fn();
    render(
      <SiteProductAddToModelPanel
        onClose={vi.fn()}
        onNewModel={onNewModel}
        onNotice={vi.fn()}
        open
        productId={11}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Створити нову модель' }));
    expect(onNewModel).toHaveBeenCalled();
  });
});
