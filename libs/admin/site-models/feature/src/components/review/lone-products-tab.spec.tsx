import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoneProductsTab } from './lone-products-tab';

import type { SiteModelListItem, SiteShowcaseRow } from '@admin/site-models/model';

const api = vi.hoisted(() => ({
  showcase: vi.fn(),
  models: vi.fn(),
  add: vi.fn(),
  openNewModel: vi.fn(),
  refetch: vi.fn(),
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteShowcaseQuery: api.showcase,
  useGetSiteModelsQuery: api.models,
  useAddSiteModelProductsMutation: () => [api.add, { isLoading: false }],
}));

vi.mock('../panels/site-model-panels-context', () => ({
  useSiteModelPanels: () => ({
    openNewModel: api.openNewModel,
    openEditModel: vi.fn(),
    openAddToModel: vi.fn(),
  }),
}));

const lone: SiteShowcaseRow = {
  key: 'p4021',
  model: null,
  name: 'Завіса 100×75 BK',
  photo: '',
  categoryId: 7,
  categoryName: 'Завіси',
  minPrice: null,
  inStock: true,
  problems: ['no_model'],
  products: [
    {
      productId: 4021,
      name: 'Завіса 100×75 BK',
      slug: 'zavisa-bk',
      photo: '',
      categoryId: 7,
      categoryName: 'Завіси',
      retailPrice: null,
      inStock: true,
      model: null,
      values: [],
      problems: ['no_model'],
    },
  ],
};

const listItem = (id: number, name: string): SiteModelListItem => ({
  id,
  categoryId: 7,
  categoryName: 'Завіси',
  name,
  slug: `m-${id}`,
  status: 'accepted',
  productCount: 2,
  onSiteCount: 2,
  minPrice: null,
  photo: '',
  axes: [],
  problems: [],
  oneCCategories: [],
});

const page = (items: readonly SiteShowcaseRow[]) => ({
  data: { items, totalCount: items.length, page: 1, pageSize: 20 },
  isError: false,
  isFetching: false,
  refetch: api.refetch,
});

describe('LoneProductsTab', () => {
  const onNotice = vi.fn();

  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    onNotice.mockReset();
    api.showcase.mockReturnValue(page([lone]));
    api.models.mockReturnValue({
      data: { items: [listItem(1, 'Ручка Rio'), listItem(2, 'Завіса 100×75')], totalCount: 2 },
      isLoading: false,
    });
    api.add.mockReturnValue({ unwrap: () => Promise.resolve({ name: 'Завіса 100×75' }) });
  });

  it('lists on-site products in no model and prefills a similar model of the category', async () => {
    render(<LoneProductsTab onNotice={onNotice} />);
    expect(api.showcase).toHaveBeenCalledWith({ status: 'none', page: 1, pageSize: 20 });
    expect(api.models).toHaveBeenCalledWith({ categoryId: 7, page: 1, pageSize: 200 });
    const picker = screen.getByRole('combobox', { name: 'Модель' }) as HTMLInputElement;
    expect(picker.value).toBe('Завіса 100×75');

    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));
    expect(api.add).toHaveBeenCalledWith({ id: 2, productIds: [4021] });
    await waitFor(() =>
      expect(onNotice).toHaveBeenCalledWith('Товар додано в модель «Завіса 100×75»'),
    );
  });

  it('shows a failed add', async () => {
    api.add.mockReturnValue({ unwrap: () => Promise.reject({ status: 403 }) });
    render(<LoneProductsTab onNotice={onNotice} />);
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));
    await waitFor(() => expect(onNotice).toHaveBeenCalledWith('Недостатньо прав для цієї дії.'));
  });

  it('opens «Нова модель» with this product, its name, and category', () => {
    render(<LoneProductsTab onNotice={onNotice} />);
    fireEvent.click(screen.getByRole('button', { name: 'Нова модель' }));
    expect(api.openNewModel).toHaveBeenCalledWith({
      productIds: [4021],
      name: 'Завіса 100×75 BK',
      categoryId: 7,
    });
  });

  it('says «Усі товари в моделях» when nothing is left', () => {
    api.showcase.mockReturnValue(page([]));
    render(<LoneProductsTab onNotice={onNotice} />);
    expect(screen.getByText('Усі товари в моделях')).toBeTruthy();
  });

  it('shows a load error and refetches on «Повторити»', () => {
    api.showcase.mockReturnValue({ ...page([]), data: undefined, isError: true });
    render(<LoneProductsTab onNotice={onNotice} />);
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(api.refetch).toHaveBeenCalled();
  });
});
