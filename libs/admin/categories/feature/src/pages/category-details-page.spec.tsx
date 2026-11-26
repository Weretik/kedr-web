import { emptyCategoryContent } from '@admin/categories/model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CategoryDetailsPage } from './category-details-page';

import type { AdminCategory } from '@admin/categories/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  one: vi.fn(),
  content: vi.fn(),
  save: vi.fn(),
}));

vi.mock('@admin/categories/data-access', () => ({
  useGetAdminCategoriesQuery: api.list,
  useGetAdminCategoryQuery: api.one,
  useGetCategoryContentQuery: api.content,
  useSaveCategoryContentMutation: () => [api.save, { isLoading: false }],
  useChangeCategorySlugMutation: () => [vi.fn(), { isLoading: false }],
  useSetCategorySiteVisibilityMutation: () => [vi.fn(), { isLoading: false }],
  useSetCategorySiteNamesMutation: () => [vi.fn(), { isLoading: false }],
  useSetCategorySearchSettingsMutation: () => [vi.fn(), { isLoading: false }],
  useMoveCategoryMutation: () => [vi.fn(), { isLoading: false }],
  useReorderCategoryMutation: () => [vi.fn(), { isLoading: false }],
  useDeleteCategoryMutation: () => [vi.fn(), { isLoading: false }],
  useAddCategorySiteModelsMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelsQuery: () => ({
    data: { items: [] },
    isLoading: false,
    isError: false,
    isFetching: false,
  }),
}));

vi.mock('@admin/media/data-access', () => ({
  useMediaPicker: () => ({ open: false, files: [], page: 1, pageCount: 1, search: '' }),
}));

const parent: AdminCategory = {
  deletedAt: null,
  id: 1,
  isDeleted: false,
  isShownOnSite: true,
  level: 0,
  nameRu: 'Фурнитура',
  nameUk: 'Фурнітура',
  parentId: null,
  slug: 'furnitura',
  sortOrder: 0,
  sourceKey: '000005513',
  sourceName: 'KEDR Фурнітура',
  productCount: 50,
  filledLanguages: ['ru', 'uk'],
  siteNameUk: null,
  siteNameRu: null,
  isClosedFromSearch: false,
  sharePicture: null,
  isManual: false,
  modelCount: 9,
  proposedModelCount: 0,
};

const category: AdminCategory = {
  ...parent,
  id: 5,
  parentId: 1,
  level: 1,
  nameUk: 'Завіси',
  nameRu: 'Петли',
  siteNameUk: 'Дверні завіси',
  sourceName: 'KEDR Завіси',
  slug: 'zavisy',
  productCount: 12,
  filledLanguages: ['uk'],
  modelCount: 0,
};

const renderPage = (canEdit: boolean, entry = '/categories/5') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route element={<CategoryDetailsPage canEdit={canEdit} />} path="/categories/:categoryId" />
      </Routes>
    </MemoryRouter>,
  );

describe('CategoryDetailsPage', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    api.list.mockReturnValue({ data: [parent, category], isError: false, isLoading: false });
    // The by-id read carries no counts; the page takes them from the list.
    api.one.mockReturnValue({
      data: { ...category, productCount: null, filledLanguages: null, modelCount: null },
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    api.content.mockReturnValue({
      data: { uk: { ...emptyCategoryContent('uk'), version: 23 }, ru: emptyCategoryContent('ru') },
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it('shows the path, «Основне», «Що бракує» and the tabs (SC-004)', () => {
    renderPage(false);

    expect(screen.getByRole('heading', { level: 1, name: 'Дверні завіси' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Фурнітура' }).getAttribute('href')).toBe(
      '/categories/1',
    );
    expect(screen.getByText('KEDR Завіси')).toBeTruthy();
    expect(screen.getByText('/uk/catalog/zavisy')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Немає тексту RU' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Моделі · 0' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Відкрити на сайті' }).getAttribute('href')).toBe(
      'https://classkedr.com.ua/uk/catalog/zavisy',
    );
  });

  it('gives managers no edit actions', () => {
    renderPage(false);
    expect(screen.queryByRole('button', { name: 'Редагувати' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Перемістити' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Сховати з сайту' })).toBeNull();
  });

  it('turns «Основне» into the names and address forms (SC-004)', () => {
    renderPage(true);
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));

    expect(screen.getByLabelText('Українською')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: /^Адреса/ })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Готово' }));
    expect(screen.queryByLabelText('Українською')).toBeNull();
  });

  it('opens the SEO tab from «Що бракує» and saves the Ukrainian text (SC-005)', async () => {
    api.save.mockReturnValue({ unwrap: () => Promise.resolve(emptyCategoryContent('uk')) });
    renderPage(true);

    fireEvent.click(screen.getByRole('button', { name: 'Немає тексту RU' }));
    expect(screen.getAllByText('Як у Google')).toHaveLength(2);
    fireEvent.click(screen.getAllByRole('button', { name: 'Редагувати' })[1]);
    fireEvent.change(screen.getByLabelText('Заголовок H1'), { target: { value: 'Дверні завіси' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(screen.getByText('Український текст збережено.')).toBeTruthy());
    expect(api.save).toHaveBeenCalledWith({
      draft: expect.objectContaining({ h1: 'Дверні завіси' }),
      id: 5,
      language: 'uk',
      version: 23,
    });
    expect(screen.queryByLabelText('Заголовок H1')).toBeNull();
  });

  it('lists subcategories for a parent and moves with a dialog (SC-006)', () => {
    api.one.mockReturnValue({ data: parent, isError: false, isLoading: false, refetch: vi.fn() });
    renderPage(true, '/categories/1?tab=place');

    expect(screen.getByRole('tab', { name: 'Підкатегорії · 1' })).toBeTruthy();
    expect(screen.getByText('1 з 1')).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Перемістити' })[0]);
    expect(screen.getByRole('dialog', { name: /Перемістити категорію/ })).toBeTruthy();
  });

  it('says when the category is not found', () => {
    api.one.mockReturnValue({ error: { code: 'NotFound' }, isError: true, isLoading: false });
    renderPage(false);
    expect(screen.getByText('Категорію не знайдено: можливо, її видалено.')).toBeTruthy();
  });
});
