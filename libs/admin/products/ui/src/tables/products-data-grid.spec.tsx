import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsDataGrid } from './products-data-grid';

describe('ProductsDataGrid responsive actions', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the product view action accessible on a phone', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('max-width'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const onViewProduct = vi.fn();
    const row = {
      id: 7,
      nameUk: 'Кабель',
      nameRu: 'Кабель',
      productSlug: 'cable',
      photo: '',
      categoryId: null,
      categoryName: 'Електрика',
      inStock: true,
      isSale: false,
      isNew: false,
      exportToSite: false,
      price: 100,
      stock: 2,
      quantityInPack: 1,
    };

    render(
      <ProductsDataGrid
        booleanFilters={{}}
        loading={false}
        filterModel={{ items: [] }}
        onFilterChange={() => undefined}
        onBooleanFilterChange={() => undefined}
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
        onRetry={() => undefined}
        onSortChange={() => undefined}
        onViewProduct={onViewProduct}
        page={0}
        pageSize={20}
        priceFilterable
        rowCount={1}
        rows={[row]}
        sort="id-asc"
      />,
    );

    expect(screen.getByRole('columnheader', { name: 'Ціна' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Дії' })).toBeTruthy();
    expect(screen.getByPlaceholderText('Пошук товарів')).toBeTruthy();
    expect(screen.queryByText('Переглянути')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути товар Кабель, ID 7' }));
    expect(onViewProduct).toHaveBeenCalledWith(row);
  });

  it('shows separate boolean columns with a check only for true values', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));

    render(
      <ProductsDataGrid
        booleanFilters={{}}
        loading={false}
        filterModel={{ items: [] }}
        onFilterChange={() => undefined}
        onBooleanFilterChange={() => undefined}
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
        onRetry={() => undefined}
        onSortChange={() => undefined}
        onViewProduct={() => undefined}
        page={0}
        pageSize={20}
        priceFilterable
        rowCount={1}
        rows={[{
          id: 7,
          nameUk: 'Кабель',
          nameRu: 'Кабель',
          productSlug: 'cable',
          photo: '/photo.jpg',
          categoryId: null,
          categoryName: 'Електрика',
          inStock: true,
          isSale: false,
          isNew: true,
          exportToSite: true,
          price: 100,
          stock: 2,
          quantityInPack: 1,
        }]}
        sort="id-asc"
      />,
    );

    expect(screen.getByRole('columnheader', { name: /Наявність/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Акція/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Новинка/ })).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: /На сайті/ })).toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Категорія' })).toBeTruthy();
    expect(screen.getAllByRole('img', { name: 'Так' })).toHaveLength(2);
    expect(screen.getByRole('img', { name: 'Ні' }).querySelector('svg')).toBeNull();
  });

  it('offers independent yes/no filters in boolean column headers', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn(),
    }));
    const onBooleanFilterChange = vi.fn();
    render(
      <ProductsDataGrid
        booleanFilters={{ inStock: false, isSale: true }}
        filterModel={{ items: [] }}
        loading={false}
        onBooleanFilterChange={onBooleanFilterChange}
        onFilterChange={() => undefined}
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
        onRetry={() => undefined}
        onSortChange={() => undefined}
        onViewProduct={() => undefined}
        page={0}
        pageSize={20}
        priceFilterable
        rowCount={0}
        rows={[]}
        sort="id-asc"
      />,
    );
    expect(screen.getByRole('combobox', { name: 'Фільтр Наявність' }).textContent).toContain('Ні');
    expect(screen.getByRole('combobox', { name: 'Фільтр Акція' }).textContent).toContain('Так');
    expect(screen.queryByRole('combobox', { name: 'Фільтр На сайті' })).toBeNull();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Фільтр Новинка' }));
    fireEvent.click(screen.getByRole('option', { name: 'Ні' }));
    expect(onBooleanFilterChange).toHaveBeenCalledWith('isNew', false);
  });
});
