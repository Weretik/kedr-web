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
    const onEditProduct = vi.fn();
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
      groupId: null,
      price: 100,
      stock: 2,
      quantityInPack: 1,
      deletedAt: null,
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
        onEditProduct={onEditProduct}
        onViewProduct={onViewProduct}
        page={0}
        pageSize={20}
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
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати товар Кабель, ID 7' }));
    expect(onEditProduct).toHaveBeenCalledWith(row);
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
            groupId: null,
            price: 100,
            stock: 2,
            quantityInPack: 1,
            deletedAt: null,
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
    expect(screen.getByRole('columnheader', { name: /Залишок/ })).toBeTruthy();
    expect(cellText('stock')).toBe('2');
    expect(cellText('isNew')).toBe('Новинка');
    expect(screen.getByRole('img', { name: 'Ні' }).textContent).toBe('—');
  });

  it('replaces «Категорія» with the «Модель» column when a model opener is given', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const onOpenModel = vi.fn();

    render(
      <ProductsDataGrid
        booleanFilters={{}}
        loading={false}
        filterModel={{ items: [] }}
        onFilterChange={() => undefined}
        onBooleanFilterChange={() => undefined}
        onOpenModel={onOpenModel}
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
        onRetry={() => undefined}
        onSortChange={() => undefined}
        onViewProduct={() => undefined}
        page={0}
        pageSize={20}
        rowCount={1}
        rows={[
          {
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
            exportToSite: true,
            groupId: 42,
            price: 100,
            stock: 2,
            quantityInPack: 1,
            deletedAt: null,
          },
        ]}
        sort="id-asc"
      />,
    );

    expect(screen.queryByRole('columnheader', { name: 'Категорія' })).toBeNull();
    expect(screen.getByRole('columnheader', { name: 'Модель' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити модель 42' }));
    expect(onOpenModel).toHaveBeenCalledWith(42);
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

  it('filters by actual stock in the «Залишок» header', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    const onBooleanFilterChange = vi.fn();
    render(
      <ProductsDataGrid
        booleanFilters={{ hasStock: false }}
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
        rowCount={0}
        rows={[]}
        sort="id-asc"
      />,
    );
    const stockFilter = screen.getByRole('combobox', { name: 'Фільтр Залишок' });
    expect(stockFilter.textContent).toContain('Немає');
    fireEvent.mouseDown(stockFilter);
    fireEvent.click(screen.getByRole('option', { name: 'Є' }));
    expect(onBooleanFilterChange).toHaveBeenCalledWith('hasStock', true);
  });

  it('keeps only search, category and the stock filter in basic mode', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }));
    render(
      <ProductsDataGrid
        basicFilters
        booleanFilters={{}}
        filterModel={{ items: [] }}
        loading={false}
        onBooleanFilterChange={() => undefined}
        onFilterChange={() => undefined}
        onPageChange={() => undefined}
        onPageSizeChange={() => undefined}
        onRetry={() => undefined}
        onSortChange={() => undefined}
        onViewProduct={() => undefined}
        page={0}
        pageSize={20}
        rowCount={0}
        rows={[]}
        sort="id-asc"
      />,
    );
    expect(screen.getByPlaceholderText('Пошук товарів')).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Категорія' })).toBeTruthy();
    expect(screen.getByRole('combobox', { name: 'Фільтр Залишок' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Фільтри' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Фільтр Наявність' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Фільтр Акція' })).toBeNull();
    expect(screen.queryByRole('combobox', { name: 'Фільтр Новинка' })).toBeNull();
  });
});
