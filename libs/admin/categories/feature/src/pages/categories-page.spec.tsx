import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CategoriesPage } from './categories-page';

import type { AdminCategory } from '@admin/categories/model';

const api = vi.hoisted(() => ({ list: vi.fn(), visibility: vi.fn() }));

vi.mock('@admin/categories/data-access', () => ({
  useGetAdminCategoriesQuery: api.list,
  useSetCategorySiteVisibilityMutation: () => [api.visibility, { isLoading: false }],
  useCreateCategoryMutation: () => [vi.fn(), { isLoading: false }],
}));

const row = (overrides: Partial<AdminCategory>): AdminCategory => ({
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
  ...overrides,
});

const rows = [
  row({}),
  row({
    id: 5,
    parentId: 1,
    level: 1,
    nameUk: 'Завіси',
    nameRu: 'Петли',
    siteNameUk: 'Дверні завіси',
    sourceName: 'KEDR Завіси',
    slug: 'zavisy',
    filledLanguages: ['uk'],
    productCount: 12,
    modelCount: 3,
  }),
];

const renderPage = (canEdit: boolean) =>
  render(
    <MemoryRouter initialEntries={['/categories']}>
      <Routes>
        <Route
          element={<CategoriesPage canEdit={canEdit} canSeeDeleted={canEdit} />}
          path="/categories"
        />
        <Route element={<p>Сторінка категорії</p>} path="/categories/:categoryId" />
      </Routes>
    </MemoryRouter>,
  );

describe('CategoriesPage', () => {
  beforeEach(() => {
    api.list.mockReset();
    api.visibility.mockReset();
    api.list.mockReturnValue({
      data: rows,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it('shows the tree table with site name, path, 1C name and counts (SC-001)', () => {
    renderPage(false);

    expect(screen.getByText('Дверні завіси')).toBeTruthy();
    expect(screen.getByText('KEDR Завіси')).toBeTruthy();
    expect(screen.getByRole('textbox', { name: 'Пошук категорій' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Нова категорія' })).toBeNull();
  });

  it('opens the category page from the row (SC-004)', () => {
    renderPage(false);
    fireEvent.click(screen.getByText('Дверні завіси'));

    expect(screen.getByText('Сторінка категорії')).toBeTruthy();
  });

  it('hides a category from the site after the confirmation (SC-002)', async () => {
    api.visibility.mockReturnValue({ unwrap: () => Promise.resolve() });
    renderPage(true);

    fireEvent.click(screen.getByRole('switch', { name: 'Сховати з сайту: Завіси' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Сховати' }));

    await waitFor(() =>
      expect(api.visibility).toHaveBeenCalledWith({ id: 5, isShownOnSite: false }),
    );
  });
});
