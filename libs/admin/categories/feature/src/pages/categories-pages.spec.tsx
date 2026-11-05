import { emptyCategoryContent } from '@admin/categories/model';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
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
  siteVisibility: vi.fn(),
}));

vi.mock('@admin/categories/data-access', () => ({
  useGetAdminCategoriesQuery: api.list,
  useGetAdminCategoryQuery: api.one,
  useGetCategoryContentQuery: api.content,
  useSaveCategoryContentMutation: () => [api.save, { isLoading: false }],
  useChangeCategorySlugMutation: () => [api.changeSlug, { isLoading: false }],
  useSetCategorySiteVisibilityMutation: () => [api.siteVisibility, { isLoading: false }],
}));

const category: AdminCategory = {
  deletedAt: null,
  id: 5,
  isDeleted: false,
  isShownOnSite: true,
  level: 0,
  nameRu: 'Петли',
  nameUk: 'Завіси',
  parentId: null,
  slug: 'zavisy',
  sortOrder: 0,
  sourceKey: '000005513',
  sourceName: 'Завіси (1С)',
  productCount: 12,
  filledLanguages: [],
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

  it('gives managers a read-only page without an edit button', () => {
    renderDetails(false);

    expect(screen.getByRole('heading', { name: 'Завіси' })).toBeTruthy();
    expect(screen.getByText('/uk/catalog/zavisy')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Редагувати' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Зберегти' })).toBeNull();
  });

  it('keeps the administrator page read-only until «Редагувати» opens the panel', () => {
    renderDetails(true);

    expect(screen.queryByLabelText('Заголовок H1')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));

    const panel = screen.getByRole('dialog', { name: 'Редагування категорії' });
    expect(within(panel).getByRole('textbox', { name: /^Адреса/ })).toBeTruthy();
    expect(within(panel).getAllByLabelText('Заголовок H1').length).toBe(2);
  });

  it('shows the tree and the first category, then selects a subcategory', () => {
    const child: AdminCategory = {
      ...category,
      id: 6,
      level: 1,
      nameUk: 'Врізні завіси',
      parentId: 5,
      slug: 'vrizni-zavisy',
    };
    api.list.mockReturnValue({
      data: [category, child],
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <CategoriesPage canSeeDeleted={false} />
      </MemoryRouter>,
    );

    const overview = screen.getByRole('article', { name: 'Завіси' });
    expect(within(overview).getAllByText('Немає тексту')).toHaveLength(2);
    expect(within(overview).queryByRole('button', { name: 'Редагувати' })).toBeNull();
    expect(screen.getByRole('treeitem', { name: /Завіси/ }).getAttribute('aria-selected')).toBe(
      'true',
    );

    fireEvent.click(within(overview).getByRole('button', { name: 'Врізні завіси' }));

    expect(screen.getByRole('article', { name: 'Врізні завіси' })).toBeTruthy();
    expect(api.content).toHaveBeenLastCalledWith(6, { skip: false });
  });

  it('finds a category by its Russian name and keeps its parent in the tree', () => {
    const child: AdminCategory = {
      ...category,
      id: 6,
      level: 1,
      nameRu: 'Врезные петли',
      nameUk: 'Врізні завіси',
      parentId: 5,
      slug: 'vrizni-zavisy',
    };
    const other: AdminCategory = {
      ...category,
      id: 7,
      nameRu: 'Замки',
      nameUk: 'Замки',
      slug: 'zamky',
      sortOrder: 1,
    };
    api.list.mockReturnValue({
      data: [category, child, other],
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <CategoriesPage canSeeDeleted={false} />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Пошук категорій' }), {
      target: { value: 'врезные' },
    });

    const tree = screen.getByRole('tree', { name: 'Категорії' });
    expect(within(tree).getByText('Завіси')).toBeTruthy();
    expect(within(tree).getByText('Врізні завіси')).toBeTruthy();
    expect(within(tree).queryByText('Замки')).toBeNull();
  });

  it('shows product counts and keeps only categories without texts on request', () => {
    const filled: AdminCategory = {
      ...category,
      filledLanguages: ['uk', 'ru'],
      id: 7,
      nameUk: 'Замки',
      productCount: 30,
      slug: 'zamky',
      sortOrder: 1,
    };
    api.list.mockReturnValue({
      data: [category, filled],
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/categories']}>
        <CategoriesPage canSeeDeleted={false} />
      </MemoryRouter>,
    );

    const tree = screen.getByRole('tree', { name: 'Категорії' });
    expect(within(tree).getByLabelText('12 товарів')).toBeTruthy();
    expect(within(tree).getByRole('img', { name: 'Немає тексту' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Без тексту · 1' }));

    expect(within(tree).getByText('Завіси')).toBeTruthy();
    expect(within(tree).queryByText('Замки')).toBeNull();
  });

  it('opens the edit panel from the overview for administrators', () => {
    render(
      <MemoryRouter initialEntries={['/categories?category=5']}>
        <CategoriesPage canEdit canSeeDeleted />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));

    expect(screen.getByRole('dialog', { name: 'Редагування категорії' })).toBeTruthy();
    expect(api.one).toHaveBeenLastCalledWith(5, { skip: false });
  });

  it('lets an administrator hide a category from the site after confirming', async () => {
    api.siteVisibility.mockReturnValue({
      unwrap: () => Promise.resolve({ id: 5, isShownOnSite: false, changedCount: 1 }),
    });
    render(
      <MemoryRouter initialEntries={['/categories?category=5']}>
        <CategoriesPage canEdit canSeeDeleted />
      </MemoryRouter>,
    );

    expect(screen.getByText('Показується на сайті')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Сховати з сайту' }));
    fireEvent.click(
      within(screen.getByRole('dialog', { name: 'Сховати з сайту?' })).getByRole('button', {
        name: 'Сховати',
      }),
    );

    expect(api.siteVisibility).toHaveBeenCalledWith({ id: 5, isShownOnSite: false });
    expect(await screen.findByText('Категорію сховано з сайту.')).toBeTruthy();
  });

  it('marks a hidden category and gives managers no visibility button', () => {
    api.list.mockReturnValue({
      data: [{ ...category, isShownOnSite: false }],
      isError: false,
      isFetching: false,
      refetch: vi.fn(),
    });
    render(
      <MemoryRouter initialEntries={['/categories?category=5']}>
        <CategoriesPage canSeeDeleted={false} />
      </MemoryRouter>,
    );

    expect(screen.getAllByLabelText('Не показується на сайті').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Показати на сайті' })).toBeNull();
  });

  it('saves the Ukrainian text of an administrator and keeps the Russian tab', async () => {
    api.save.mockReturnValue({ unwrap: () => Promise.resolve(emptyCategoryContent('uk')) });
    renderDetails(true);
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));

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
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати' }));

    fireEvent.change(screen.getAllByLabelText('SEO-заголовок (title)')[0], {
      target: { value: 'a'.repeat(71) },
    });
    fireEvent.click(screen.getAllByRole('button', { name: 'Зберегти' })[0]);

    expect(api.save).not.toHaveBeenCalled();
    expect(screen.getAllByText(/Не більше 70 символів/).length).toBeGreaterThan(0);
  });
});
