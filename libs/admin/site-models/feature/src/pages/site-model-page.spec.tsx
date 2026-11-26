import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteModelPage } from './site-model-page';
import { SiteModelPanelsProvider } from '../components/panels/site-model-panels-provider';

import type { SiteModel } from '@admin/site-models/model';

const api = vi.hoisted(() => ({
  model: vi.fn(),
  accept: vi.fn(),
  add: vi.fn(),
  idle: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelQuery: api.model,
  useGetSiteShowcaseQuery: () => ({
    data: {
      items: [
        {
          products: [
            {
              productId: 13,
              name: 'Ручка 13',
              photo: '',
              categoryName: 'Ручки',
              model: { id: 9, name: 'Мілан', status: 'accepted' },
            },
          ],
        },
        {
          products: [
            {
              productId: 12,
              name: 'Накладка 12',
              photo: '',
              categoryName: 'Накладки',
              model: null,
            },
          ],
        },
      ],
    },
    isFetching: false,
  }),
  useGetAttributeValueOptionsQuery: () => ({ data: undefined }),
  useGetAttributeOptionsQuery: () => ({ data: [] }),
  useGetSiteModelCategoriesQuery: () => ({ data: [], isLoading: false }),
  useChangeSiteModelCategoryMutation: api.idle,
  useAcceptSiteModelsMutation: () => [api.accept, { isLoading: false }],
  useAddSiteModelProductsMutation: () => [api.add, { isLoading: false }],
  useRenameSiteModelMutation: api.idle,
  useSetSiteModelAxesMutation: api.idle,
  useRemoveSiteModelProductMutation: api.idle,
  useFillSiteModelFromNamesMutation: api.idle,
  useSetSiteModelTextMutation: api.idle,
  useSetProductAttributeMutation: api.idle,
  useCreateAttributeOptionMutation: api.idle,
  useCreateAttributeValueOptionMutation: api.idle,
}));

const model: SiteModel = {
  id: 5,
  categoryId: 3,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'proposed',
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: null,
  axes: [],
  products: [
    {
      productId: 11,
      name: 'Ручка Рим хром',
      slug: 'p',
      photo: '',
      retailPrice: null,
      inStock: true,
      exportToSite: true,
      isMain: true,
      values: [],
      problems: [],
    },
  ],
  texts: [],
  characteristics: [{ attributeId: 1, name: 'Матеріал', values: ['Латунь'] }],
  problems: ['model_no_seo'],
  oneCCategories: ['Накладки'],
};

const renderPage = (state?: unknown) =>
  render(
    <MemoryRouter initialEntries={[{ pathname: '/site-models/5', state }]}>
      <SiteModelPanelsProvider>
        <Routes>
          <Route element={<SiteModelPage />} path="/site-models/:id" />
        </Routes>
      </SiteModelPanelsProvider>
    </MemoryRouter>,
  );

describe('SiteModelPage', () => {
  beforeEach(() => {
    [api.model, api.accept, api.add].forEach((mock) => mock.mockReset());
    api.model.mockReturnValue({ data: model, isLoading: false, isError: false });
  });

  it('shows the read-only blocks with the back link keeping the list (SC-006)', () => {
    renderPage({ listSearch: '?search=рим&panel=edit-1' });
    expect(screen.getByRole('heading', { level: 1, name: 'Ручка Рим' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'До моделей' }).getAttribute('href')).toBe(
      '/site-models?search=%D1%80%D0%B8%D0%BC',
    );
    expect(screen.getByText('Не перевірена')).toBeTruthy();
    expect(screen.getByText('У 1С: Накладки')).toBeTruthy();
    expect(screen.getByText('Ручка Рим хром')).toBeTruthy();
    expect(screen.getByText('Латунь')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'SEO та опис' })).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
  });

  it('accepts a proposal with «Погодити»', async () => {
    api.accept.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Погодити' }));
    await waitFor(() => expect(api.accept).toHaveBeenCalledWith([5]));
  });

  it('adds a free product of another 1C category from «Додати товар» (SC-006)', async () => {
    api.add.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Додати товар' }));
    const boxes = await screen.findAllByRole('checkbox');
    expect(boxes.map((box) => box.getAttribute('aria-label'))).toEqual(['Накладка 12', 'Ручка 13']);
    fireEvent.click(screen.getByText('Накладка 12'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати (1)' }));
    await waitFor(() => expect(api.add).toHaveBeenCalledWith({ id: 5, productIds: [12] }));
  });

  it('opens «Редагування моделі» with «Редагувати»', async () => {
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));
    expect(await screen.findByRole('heading', { name: 'Редагування моделі' })).toBeTruthy();
  });

  it('shows loading, then a load error with «Повторити» (SC-012)', () => {
    const refetch = vi.fn();
    api.model.mockReturnValue({ data: undefined, isLoading: true, isError: false, refetch });
    const { unmount } = renderPage();
    expect(screen.getByRole('status', { name: 'Завантаження моделі' })).toBeTruthy();
    unmount();
    api.model.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
    renderPage();
    expect(screen.getByText('Не вдалося завантажити модель.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(refetch).toHaveBeenCalled();
  });
});
