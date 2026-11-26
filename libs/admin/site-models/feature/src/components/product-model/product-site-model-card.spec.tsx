import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductSiteModelCard } from './product-site-model-card';

import type { SiteShowcaseItem } from '@admin/site-models/model';

const api = vi.hoisted(() => ({
  showcase: vi.fn(),
  openNewModel: vi.fn(),
  openAddToModel: vi.fn(),
}));

vi.mock('@admin/site-models/data-access', () => ({ useGetSiteShowcaseQuery: api.showcase }));

vi.mock('../panels/site-model-panels-context', () => ({
  useSiteModelPanels: () => ({
    openNewModel: api.openNewModel,
    openAddToModel: api.openAddToModel,
    openEditModel: vi.fn(),
  }),
}));

function item(model: SiteShowcaseItem['model']): SiteShowcaseItem {
  return {
    productId: 4021,
    name: 'Завіса 100×75 BK',
    slug: 'zavisa-bk',
    photo: '',
    categoryId: 7,
    categoryName: 'Завіси',
    retailPrice: null,
    inStock: true,
    model,
    values: [],
    problems: [],
  };
}

function answer(items: SiteShowcaseItem[]) {
  api.showcase.mockReturnValue({
    data: { items: items.map((product) => ({ products: [product] })), totalCount: items.length },
    isLoading: false,
    isError: false,
    refetch: vi.fn(),
  });
}

const show = () =>
  render(
    <MemoryRouter>
      <ProductSiteModelCard productId={4021} />
    </MemoryRouter>,
  );

describe('ProductSiteModelCard (spec 001 SC-011)', () => {
  beforeEach(() => vi.clearAllMocks());

  it('links to the model the product is in and looks it up by its 1C code', () => {
    answer([item({ id: 5, name: 'Завіса 100×75', status: 'proposed' })]);
    show();

    expect(api.showcase).toHaveBeenCalledWith(expect.objectContaining({ search: '4021', page: 1 }));
    expect(screen.getByRole('link', { name: 'Завіса 100×75' }).getAttribute('href')).toBe(
      '/site-models/5',
    );
    expect(screen.getByText('Не перевірена')).toBeTruthy();
  });

  it('offers both shared panels for a product in no model', () => {
    answer([item(null)]);
    show();

    expect(screen.getByText('Без моделі')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Додати в модель' }));
    expect(api.openAddToModel).toHaveBeenCalledWith({ productId: 4021 });
    fireEvent.click(screen.getByRole('button', { name: 'Нова модель' }));
    expect(api.openNewModel).toHaveBeenCalledWith({
      productIds: [4021],
      name: 'Завіса 100×75 BK',
      categoryId: 7,
    });
  });

  it('says the product is not on the site when the showcase does not have it', () => {
    answer([]);
    show();

    expect(screen.getByText('Товар не показується на сайті.')).toBeTruthy();
  });

  it('shows an error with «Повторити»', () => {
    const refetch = vi.fn();
    api.showcase.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
    show();

    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(refetch).toHaveBeenCalled();
  });
});
