import { emptyCategoryContent } from '@admin/categories/model';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CategoriesPage } from './categories-page';
import { CategoryDetailsPage } from './category-details-page';

import type { AdminCategory } from '@admin/categories/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  one: vi.fn(),
  content: vi.fn(),
  save: vi.fn(),
  changeSlug: vi.fn(),
}));

vi.mock('@admin/categories/data-access', () => ({
  useGetAdminCategoriesQuery: api.list,
  useGetAdminCategoryQuery: api.one,
  useGetCategoryContentQuery: api.content,
  useSaveCategoryContentMutation: () => [api.save, { isLoading: false }],
  useChangeCategorySlugMutation: () => [api.changeSlug, { isLoading: false }],
}));

const category: AdminCategory = {
  deletedAt: null,
  id: 5,
  isDeleted: false,
  level: 0,
  nameRu: 'Петли',
  nameUk: 'Завіси',
  parentId: null,
  slug: 'zavisy',
  sortOrder: 0,
  sourceKey: '000005513',
  sourceName: 'Завіси (1С)',
};

const renderDetails = (canEdit: boolean) =>
  render(
    <MemoryRouter initialEntries={['/categories/5']}>
      <Routes>
        <Route element={<CategoryDetailsPage canEdit={canEdit} />} path="/categories/:categoryId" />
      </Routes>
    </MemoryRouter>,
  );

describe('categories pages', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    api.list.mockReturnValue({
      data: [category],
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    });
    api.one.mockReturnValue({ data: category, isError: false, isLoading: false, refetch: vi.fn() });
    api.content.mockReturnValue({
      data: { uk: emptyCategoryContent('uk'), ru: emptyCategoryContent('ru') },
      isError: false,
      isLoading: false,
      refetch: vi.fn(),
    });
  });

  it('shows the deleted tab to administrators only', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/categories?tab=deleted']}>
        <CategoriesPage canSeeDeleted={false} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('tab', { name: 'Видалені' })).toBeNull();
    expect(api.list).toHaveBeenLastCalledWith({ deleted: false });
    unmount();

    render(
      <MemoryRouter initialEntries={['/categories?tab=deleted']}>
        <CategoriesPage canSeeDeleted />
      </MemoryRouter>,
    );
    expect(screen.getByRole('tab', { name: 'Видалені' }).getAttribute('aria-selected')).toBe(
      'true',
    );
    expect(api.list).toHaveBeenLastCalledWith({ deleted: true });
  });

  it('gives managers a read-only page', () => {
    renderDetails(false);

    expect(screen.getByRole('heading', { name: 'Завіси' })).toBeTruthy();
    expect(screen.getByText('/uk/catalog/zavisy')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Змінити' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Зберегти' })).toBeNull();
  });

  it('saves the Ukrainian text of an administrator and keeps the Russian tab', async () => {
    api.save.mockReturnValue({ unwrap: () => Promise.resolve(emptyCategoryContent('uk')) });
    renderDetails(true);

    fireEvent.change(screen.getAllByLabelText('Заголовок H1')[0], {
      target: { value: 'Дверні завіси' },
    });
    expect(screen.getByRole('tab', { name: 'Українська •' })).toBeTruthy();
    fireEvent.click(screen.getAllByRole('button', { name: 'Зберегти' })[0]);

    await waitFor(() => expect(screen.getByText('Український текст збережено.')).toBeTruthy());
    expect(api.save).toHaveBeenCalledWith({
      draft: expect.objectContaining({ h1: 'Дверні завіси' }),
      id: 5,
      language: 'uk',
    });
  });

  it('does not send content over the limits', () => {
    renderDetails(true);

    fireEvent.change(screen.getAllByLabelText('SEO-заголовок (title)')[0], {
      target: { value: 'a'.repeat(71) },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Зберегти' })[0]);

    expect(api.save).not.toHaveBeenCalled();
    expect(screen.getAllByText(/Не більше 70 символів/).length).toBeGreaterThan(0);
  });
});
