import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteModelsQueue } from './site-models-queue';

import type { SiteModel, SiteModelCategory, SiteShowcaseRow } from '@admin/site-models/model';

const api = vi.hoisted(() => ({
  showcase: vi.fn(),
  model: vi.fn(),
  accept: vi.fn(),
  add: vi.fn(),
  idle: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelCategoriesQuery: () => ({ data: [category], isLoading: false }),
  useGetSiteShowcaseQuery: api.showcase,
  useGetSiteModelQuery: api.model,
  useGetAttributeOptionsQuery: () => ({ data: [] }),
  useGetAttributeValueOptionsQuery: () => ({ data: undefined }),
  useAcceptSiteModelsMutation: () => [api.accept, { isLoading: false }],
  useAddSiteModelProductsMutation: () => [api.add, { isLoading: false }],
  useCreateSiteModelMutation: api.idle,
  useRenameSiteModelMutation: api.idle,
  useSetSiteModelAxesMutation: api.idle,
  useRemoveSiteModelProductMutation: api.idle,
  useFillSiteModelFromNamesMutation: api.idle,
  useSetSiteModelTextMutation: api.idle,
  useSetProductAttributeMutation: api.idle,
  useCreateAttributeOptionMutation: api.idle,
  useCreateAttributeValueOptionMutation: api.idle,
}));

const category: SiteModelCategory = {
  id: 7,
  name: 'Завіси',
  parentId: null,
  onSiteProducts: 5,
  acceptedModels: 1,
  proposedModels: 2,
  problemCount: 1,
  loneProducts: 0,
  filterCount: 2,
};

const row = (id: number, name: string, productIds: number[]): SiteShowcaseRow => ({
  key: `m${id}`,
  model: { id, name, status: 'proposed' },
  name,
  photo: '',
  categoryId: 7,
  categoryName: 'Завіси',
  minPrice: null,
  inStock: true,
  products: productIds.map((productId) => ({
    productId,
    name: `${name} ${productId}`,
    slug: `p-${productId}`,
    photo: '',
    categoryId: 7,
    categoryName: 'Завіси',
    retailPrice: null,
    inStock: true,
    model: { id, name, status: 'proposed' },
    values: [],
    problems: [],
  })),
  problems: [],
});

const model = (id: number, name: string): SiteModel => ({
  id,
  categoryId: 7,
  categoryName: 'Завіси',
  name,
  slug: `m-${id}`,
  status: 'proposed',
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: null,
  axes: [],
  products: [],
  texts: [],
  characteristics: [],
  problems: [],
});

function Address() {
  const location = useLocation();
  return <output aria-label="Адреса">{location.search}</output>;
}

const renderQueue = (entry = '/site-showcase') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SiteModelsQueue onNotice={vi.fn()} />
      <Address />
    </MemoryRouter>,
  );

describe('SiteModelsQueue', () => {
  beforeEach(() => {
    [api.showcase, api.model, api.accept, api.add].forEach((mock) => mock.mockReset());
    api.showcase.mockReturnValue({
      data: {
        items: [row(1, 'Завіса 100×75', [11, 12]), row(2, 'Завіса 100×75 BK', [13])],
        totalCount: 2,
        page: 1,
        pageSize: 200,
      },
      isError: false,
      isFetching: false,
    });
    api.model.mockImplementation((id: number) => ({
      data: model(id, id === 1 ? 'Завіса 100×75' : 'Завіса 100×75 BK'),
      isError: false,
      isLoading: false,
    }));
    api.accept.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    api.add.mockReturnValue({ unwrap: () => Promise.resolve(model(1, 'Завіса 100×75')) });
  });

  it('opens the first proposal with the counts of the views', () => {
    renderQueue();
    expect(screen.getByRole('button', { name: 'На перевірку · 2' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'З проблемами · 1' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Без моделі/ })).toBeNull();
    expect(screen.getByRole('heading', { name: 'Завіса 100×75' })).toBeTruthy();
    expect(screen.getByText('Не перевірена')).toBeTruthy();
    expect(api.showcase).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'proposed', page: 1, pageSize: 200 }),
    );
  });

  it('accepts one model and moves to the next', async () => {
    renderQueue();
    fireEvent.click(screen.getByRole('button', { name: 'Погодити і далі' }));
    expect(api.accept).toHaveBeenCalledWith([1]);
    await waitFor(() => expect(screen.getByLabelText('Адреса').textContent).toBe('?item=m2'));
  });

  it('merges a similar proposal into the open model', () => {
    renderQueue();
    fireEvent.click(screen.getByRole('button', { name: 'Об’єднати сюди' }));
    expect(api.add).toHaveBeenCalledWith({ id: 1, productIds: [13] });
  });

  it('shows the SEO texts in their own tab', () => {
    renderQueue('/site-showcase?item=m2');
    expect(screen.getByRole('heading', { name: 'Завіса 100×75 BK' })).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'SEO та опис' }));
    expect(screen.getByLabelText('Як виглядатиме в Google')).toBeTruthy();
  });
});
