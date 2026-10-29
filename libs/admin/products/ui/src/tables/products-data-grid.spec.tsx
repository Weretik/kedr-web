import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ProductsDataGrid } from './products-data-grid';

describe('ProductsDataGrid responsive actions', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('keeps the product view action and toolbar controls accessible on a phone', async () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query.includes('max-width'),
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const onViewProduct = vi.fn();
    const onFilterChange = vi.fn();
    const row = {
      id: 7,
      nameUk: 'Кабель',
      nameRu: 'Кабель RU',
      productSlug: 'cable',
      photo: '',
      categoryId: 3,
      categoryName: '',
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
        categories={[
          {
            id: 1,
            parentId: null,
            nameUk: 'Фурнітура',
            pathUk: 'Фурнітура',
            depth: 0,
            hasChildren: true,
          },
          {
            id: 2,
            parentId: 1,
            nameUk: 'Завіси',
            pathUk: 'Фурнітура Завіси',
            depth: 1,
            hasChildren: true,
          },
          {
            id: 3,
            parentId: 2,
            nameUk: 'Кабелі',
            pathUk: 'Фурнітура Завіси Кабелі',
            depth: 2,
            hasChildren: false,
          },
        ]}
        booleanFilters={{}}
        loading={false}
        filterModel={{ items: [] }}
        onFilterChange={onFilterChange}
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

    expect(screen.getByRole('columnheader', { name: 'Ціна (роздріб)' })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: 'Дії' })).toBeTruthy();
    const searchInput = screen.getByPlaceholderText('Пошук товарів');
    expect(searchInput.getAttribute('aria-label')).toBe('Пошук товарів');
    expect(
      searchInput
        .closest('.MuiInputBase-root')
        ?.querySelector('[data-testid="SearchOutlinedIcon"]'),
    ).toBeTruthy();
    const filterTrigger = screen.getByRole('button', { name: 'Фільтри' });
    expect(
      searchInput.compareDocumentPosition(filterTrigger) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Очистити пошук товарів' })).toBeNull();
    fireEvent.change(searchInput, { target: { value: '  Кабель  ' } });
    await waitFor(() =>
      expect(
        onFilterChange.mock.calls.some(([model]) => model.quickFilterValues?.[0] === 'Кабель'),
      ).toBe(true),
    );
    fireEvent.click(filterTrigger);
    expect(filterTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText('Фурнітура › Завіси › Кабелі')).toBeTruthy();
    expect(screen.queryByText('Кабель RU')).toBeNull();
    expect(screen.queryByText('Переглянути')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути товар Кабель, ID 7' }));
    expect(onViewProduct).toHaveBeenCalledWith(row);
  }, 10000);

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
        rows={[
          {
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
          },
        ]}
        sort="id-asc"
      />,
    );

    expect(screen.getByRole('columnheader', { name: /Наявність/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Акція/ })).toBeTruthy();
    expect(screen.getByRole('columnheader', { name: /Новинка/ })).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: /На сайті/ })).toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Категорія' })).toBeTruthy();
    const cellText = (field: string) =>
      document.querySelector(`[role="gridcell"][data-field="${field}"]`)?.textContent;
    expect(cellText('inStock')).toBe('Є');
    expect(cellText('isNew')).toBe('Новинка');
    expect(screen.getByRole('img', { name: 'Ні' }).textContent).toBe('—');
  });

  it('offers independent yes/no filters in boolean column headers', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
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
