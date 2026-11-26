import { buildCategoryTree, categoryTableRows } from '@admin/categories/model';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryTreeGrid } from './category-tree-grid';

import type { AdminCategory } from '@admin/categories/model';

const category = (overrides: Partial<AdminCategory>): AdminCategory => ({
  deletedAt: null,
  id: 1,
  isDeleted: false,
  isShownOnSite: true,
  level: 0,
  nameRu: 'Замки',
  nameUk: 'Замки',
  parentId: null,
  slug: 'zamky',
  sortOrder: 0,
  sourceKey: '1',
  sourceName: 'KEDR Замки',
  productCount: 145,
  filledLanguages: ['ru', 'uk'],
  siteNameUk: null,
  siteNameRu: null,
  isClosedFromSearch: false,
  sharePicture: null,
  isManual: false,
  modelCount: 31,
  proposedModelCount: 0,
  ...overrides,
});

const tree = buildCategoryTree([
  category({ id: 1300 }),
  category({
    id: 1304,
    parentId: 1300,
    nameUk: 'Навісні',
    siteNameUk: 'Навісні та велозамки',
    siteNameRu: 'Навесные и велозамки',
    sourceName: 'KEDR Замки навісні та велозамки',
    productCount: 37,
    modelCount: 0,
    filledLanguages: ['uk'],
  }),
]);

const renderGrid = (onToggleSite?: (row: AdminCategory) => void) => {
  const handlers = { onOpen: vi.fn(), onToggleOpen: vi.fn() };
  render(
    <CategoryTreeGrid
      emptyMessage="Категорій немає."
      error={false}
      loading={false}
      onRetry={vi.fn()}
      onToggleSite={onToggleSite}
      rows={categoryTableRows(tree, new Set([1300]))}
      {...handlers}
    />,
  );
  return handlers;
};

describe('CategoryTreeGrid', () => {
  it('shows site name, path, 1C name, ID, counts and only the problems (SC-001, SC-003)', () => {
    renderGrid();

    expect(screen.getByText('Навісні та велозамки')).toBeTruthy();
    expect(screen.getByText('Навесные и велозамки')).toBeTruthy();
    expect(screen.getByText('KEDR Замки навісні та велозамки')).toBeTruthy();
    expect(screen.getByText('1304')).toBeTruthy();
    expect(screen.getByText('37')).toBeTruthy();
    expect(screen.getByText('Немає тексту RU')).toBeTruthy();
    expect(screen.getByText('Немає моделей')).toBeTruthy();
    expect(screen.getAllByText('Замки').length).toBeGreaterThan(0);
  });

  it('opens a parent with the arrow and a category with a row click', () => {
    const handlers = renderGrid();

    fireEvent.click(screen.getByRole('button', { name: 'Згорнути: Замки' }));
    expect(handlers.onToggleOpen).toHaveBeenCalledWith(1300);
    expect(handlers.onOpen).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('KEDR Замки навісні та велозамки'));
    expect(handlers.onOpen).toHaveBeenCalledWith(1304);
  });

  it('lets administrators flip «На сайті» and keeps it read-only for managers (SC-002)', () => {
    const onToggleSite = vi.fn();
    renderGrid(onToggleSite);
    fireEvent.click(screen.getByRole('switch', { name: 'Сховати з сайту: Навісні' }));
    expect(onToggleSite).toHaveBeenCalledWith(expect.objectContaining({ id: 1304 }));
  });

  it('disables the switch without the right to change it', () => {
    renderGrid();
    expect(
      (screen.getByRole('switch', { name: 'Сховати з сайту: Навісні' }) as HTMLInputElement)
        .disabled,
    ).toBe(true);
  });
});
