import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ProductDetailsPage } from './product-details-page';
import { ProductsPage } from './products-page';

const api = vi.hoisted(() => ({
  all: vi.fn(), missing: vi.fn(), details: vi.fn(), categories: vi.fn(),
}));

vi.mock('@admin/products/data-access', () => ({
  useGetProductsListQuery: api.all,
  useGetMissingPhotoProductsQuery: api.missing,
  useGetAdminProductDetailsQuery: api.details,
  useGetAdminProductCategoriesQuery: api.categories,
}));

vi.mock('@admin/products/ui', async (importOriginal) => ({
  ...await importOriginal<typeof import('@admin/products/ui')>(),
  ProductsDataGrid: ({ onBooleanFilterChange, onViewProduct, rows }: {
    onBooleanFilterChange: (field: 'isSale', value: boolean) => void;
    onViewProduct: (row: { productSlug: string }) => void;
    rows: { productSlug: string }[];
  }) => (
    <>
      <button onClick={() => onViewProduct(rows[0])}>Відкрити тестовий товар</button>
      <button onClick={() => onBooleanFilterChange('isSale', false)}>Фільтр Акція Ні</button>
    </>
  ),
}));

function Location() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}</output>;
}

describe('products navigation context', () => {
  beforeEach(() => {
    api.all.mockReset(); api.missing.mockReset(); api.details.mockReset(); api.categories.mockReset();
    api.categories.mockReturnValue({ data: [], isFetching: false, isError: false });
    api.all.mockReturnValue({ data: { items: [], totalRecords: 0 }, refetch: vi.fn() });
    api.missing.mockReturnValue({ data: { items: [{ id: 7, nameUk: 'Кабель', productSlug: 'cable' }], totalRecords: 1 }, refetch: vi.fn() });
    api.details.mockReturnValue({ data: { id: 7, nameUk: 'Кабель', nameRu: 'Кабель', productSlug: 'cable', photo: '', scheme: '', stock: 2, categoryId: 3, categoryName: 'Електрика', quantityInPack: 1, price: 10, inStock: true, isSale: false, isNew: false, exportToSite: false }, refetch: vi.fn() });
  });

  it('restores missing mode and page after details', async () => {
    render(
      <MemoryRouter initialEntries={['/catalog?mode=missing&missingPage=2&searchTerm=cable']}>
        <Location />
        <Routes>
          <Route element={<ProductsPage />} path="/catalog" />
          <Route element={<ProductDetailsPage />} path="/catalog/:productSlug" />
        </Routes>
      </MemoryRouter>,
    );
    expect(api.missing).toHaveBeenCalledWith(expect.objectContaining({ page: 2, pageSize: 20 }), { skip: false });
    fireEvent.click(screen.getByRole('button', { name: 'Відкрити тестовий товар' }));
    expect(screen.getByTestId('location').textContent).toContain('/catalog/cable?mode=missing');
    fireEvent.click(screen.getByRole('link', { name: 'Назад до товарів' }));
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Без фото' }).getAttribute('aria-selected')).toBe('true'));
    expect(screen.getByTestId('location').textContent).toContain('missingPage=2');
  });

  it('uses a separate server query when switching to missing photos', async () => {
    render(<MemoryRouter initialEntries={['/catalog?page=3&searchTerm=cable']}><Routes><Route element={<ProductsPage />} path="/catalog" /></Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole('tab', { name: 'Без фото' }));
    await waitFor(() => expect(api.missing).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, pageSize: 20 }), { skip: false }));
  });

  it('uses the full list endpoint with exportToSite=true in the site tab', async () => {
    render(<MemoryRouter initialEntries={['/catalog?page=3&searchTerm=cable']}><Routes><Route element={<ProductsPage />} path="/catalog" /></Routes></MemoryRouter>);
    fireEvent.click(screen.getByRole('tab', { name: 'На сайті' }));
    await waitFor(() => expect(api.all).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, exportToSite: true }), { skip: false }));
    expect(api.missing).toHaveBeenLastCalledWith(expect.anything(), { skip: true });
  });

  it('combines a boolean filter with existing missing-photo filters and resets its page', async () => {
    render(<MemoryRouter initialEntries={['/catalog?mode=missing&missingPage=3&missingInStock=true&missingIsSale=true']}>
      <Location />
      <Routes><Route element={<ProductsPage />} path="/catalog" /></Routes>
    </MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Фільтр Акція Ні' }));
    await waitFor(() => expect(api.missing).toHaveBeenLastCalledWith(expect.objectContaining({
      page: 1, inStock: true, isSale: false,
    }), { skip: false }));
    expect(screen.getByTestId('location').textContent).toContain('missingIsSale=false');
    expect(screen.getByTestId('location').textContent).not.toContain('missingPage=3');
  });

  it('shows the missing-product state for the normalized 404 error', () => {
    api.details.mockReturnValue({ error: { code: 'NotFound', status: 404 }, isError: true, refetch: vi.fn() });
    render(<MemoryRouter initialEntries={['/catalog/unknown']}><Routes><Route element={<ProductDetailsPage />} path="/catalog/:productSlug" /></Routes></MemoryRouter>);
    expect(screen.getByText('Товар за цим посиланням не знайдено.')).toBeTruthy();
  });

  it('skips the request for an invalid product slug', () => {
    render(<MemoryRouter initialEntries={['/catalog/%20']}><Routes><Route element={<ProductDetailsPage />} path="/catalog/:productSlug" /></Routes></MemoryRouter>);
    expect(api.details).toHaveBeenCalledWith('', { skip: true });
    expect(screen.getByText('Товар за цим посиланням не знайдено.')).toBeTruthy();
  });

  it('keeps the storage link and hides a failed scheme', async () => {
    api.details.mockReturnValue({
      data: {
        id: 7, nameUk: 'Кабель', nameRu: 'Кабель RU', productSlug: 'cable',
        photo: 'https://images-kedr.cdn.express/products/7.jpg', scheme: 'https://images-kedr.cdn.express/schemes/7.jpg',
        stock: 2, categoryId: 3, categoryName: 'Електрика', quantityInPack: 1,
        price: 10, inStock: true, isSale: false, isNew: false, exportToSite: true,
      },
      refetch: vi.fn(),
    });
    render(<MemoryRouter initialEntries={['/catalog/cable']}><Routes><Route element={<ProductDetailsPage />} path="/catalog/:productSlug" /></Routes></MemoryRouter>);
    const photoHeading = screen.getByRole('heading', { name: 'Фото товару' });
    const infoHeading = screen.getByRole('heading', { name: 'Кабель' });
    const schemeHeading = screen.getByRole('heading', { name: 'Схема товару' });
    expect(photoHeading.compareDocumentPosition(infoHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(infoHeading.compareDocumentPosition(schemeHeading) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Сховище фото' }).getAttribute('href')).toBe('https://images-kedr.cdn.express/~/o/products');
    expect(screen.queryByRole('link', { name: 'Відкрити JPG' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Відкрити на сайті' }).getAttribute('href')).toContain('/uk/catalog/product/cable');
    expect(screen.getByText('Наявність')).toBeTruthy();
    expect(screen.getByText('На сайті')).toBeTruthy();
    expect(screen.queryByText('Акція')).toBeNull();
    expect(screen.queryByText('Новинка')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Збільшити фото товару' }));
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    const schemeButton = screen.getByRole('button', { name: 'Збільшити схему товару' });
    fireEvent.error(schemeButton.querySelector('img')!);
    expect(screen.queryByRole('heading', { name: 'Схема товару' })).toBeNull();
  });
});
