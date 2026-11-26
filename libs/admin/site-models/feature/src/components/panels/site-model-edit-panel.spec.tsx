import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteModelEditPanel } from './site-model-edit-panel';

import type { SiteModel } from '@admin/site-models/model';

const api = vi.hoisted(() => ({
  model: vi.fn(),
  change: vi.fn(),
  idle: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelQuery: api.model,
  useGetSiteModelCategoriesQuery: () => ({
    data: [
      { id: 1, name: 'Фурнітура', parentId: null },
      { id: 3, name: 'Ручки', parentId: 1 },
      { id: 4, name: 'Накладки', parentId: 1 },
    ],
    isLoading: false,
  }),
  useGetAttributeOptionsQuery: () => ({ data: [] }),
  useChangeSiteModelCategoryMutation: () => [api.change, { isLoading: false }],
  useAcceptSiteModelsMutation: api.idle,
  useRenameSiteModelMutation: api.idle,
  useSetSiteModelAxesMutation: api.idle,
  useAddSiteModelProductsMutation: api.idle,
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
  products: [],
  texts: [],
  characteristics: [],
  problems: [],
  oneCCategories: [],
};

const renderPanel = () =>
  render(<SiteModelEditPanel modelId={5} onClose={vi.fn()} onNotice={vi.fn()} open />);

describe('SiteModelEditPanel', () => {
  beforeEach(() => {
    api.change.mockReset();
    api.model.mockReturnValue({ data: model, isLoading: false, isError: false });
  });

  it('has the four blocks, each with its own save', () => {
    renderPanel();
    expect(screen.getByRole('heading', { name: 'Редагування моделі' })).toBeTruthy();
    ['Назва', 'Категорія на сайті', 'Перемикачі', 'SEO та опис'].forEach((title) =>
      expect(screen.getByRole('heading', { name: title })).toBeTruthy(),
    );
    expect(screen.getByRole('button', { name: 'Зберегти назву' })).toBeTruthy();
    expect(screen.getByText(/Пропозицію буде погоджено/)).toBeTruthy();
  });

  it('saves another final category; a parent is not offered; an error is shown (SC-004)', async () => {
    api.change.mockReturnValueOnce({ unwrap: () => Promise.reject({ status: 500 }) });
    renderPanel();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Категорія на сайті' }));
    expect(screen.queryByRole('option', { name: 'Фурнітура' })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: 'Фурнітура / Накладки' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти категорію' }));
    expect(api.change).toHaveBeenCalledWith({ id: 5, categoryId: 4 });
    expect(await screen.findByText('Не вдалося зберегти. Спробуйте ще раз.')).toBeTruthy();
  });

  it('shows a load error with «Повторити»', async () => {
    const refetch = vi.fn();
    api.model.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
    renderPanel();
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    await waitFor(() => expect(refetch).toHaveBeenCalled());
  });
});
