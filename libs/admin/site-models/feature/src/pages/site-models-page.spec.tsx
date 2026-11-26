import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteModelsPage } from './site-models-page';
import { SiteModelPanelsProvider } from '../components/panels/site-model-panels-provider';

import type { SiteModel, SiteModelListItem } from '@admin/site-models/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  model: vi.fn(),
  change: vi.fn(),
  create: vi.fn(),
  refetch: vi.fn(),
  setValue: vi.fn(),
  idle: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelsQuery: api.list,
  useGetSiteModelQuery: api.model,
  useGetSiteModelCategoriesQuery: () => ({
    data: [
      { id: 1, name: 'Фурнітура', parentId: null, acceptedModels: 2, proposedModels: 0 },
      { id: 3, name: 'Ручки', parentId: 1, acceptedModels: 1, proposedModels: 0 },
      { id: 4, name: 'Накладки', parentId: 1, acceptedModels: 1, proposedModels: 0 },
    ],
    isLoading: false,
  }),
  useGetSiteShowcaseQuery: () => ({
    data: {
      items: [11, 12].map((productId) => ({
        products: [
          { productId, name: `Ручка ${productId}`, photo: '', categoryName: 'Ручки', model: null },
        ],
      })),
    },
    isFetching: false,
  }),
  useGetAttributeOptionsQuery: () => ({ data: [] }),
  useGetAttributeValueOptionsQuery: (id: unknown) => ({
    data:
      id === 1
        ? [
            { id: 4, name: 'Нікель матовий' },
            { id: 5, name: 'Матовий нікель' },
          ]
        : undefined,
  }),
  useGetProductAttributesQuery: () => ({ data: undefined, isLoading: true, isError: false }),
  useAcceptProductReviewMutation: api.idle,
  useReopenProductReviewMutation: api.idle,
  useRestoreProductAttributeMutation: api.idle,
  useChangeSiteModelCategoryMutation: () => [api.change, { isLoading: false }],
  useCreateSiteModelMutation: () => [api.create, { isLoading: false }],
  useAcceptSiteModelsMutation: api.idle,
  useRenameSiteModelMutation: api.idle,
  useSetSiteModelAxesMutation: api.idle,
  useAddSiteModelProductsMutation: api.idle,
  useRemoveSiteModelProductMutation: api.idle,
  useFillSiteModelFromNamesMutation: api.idle,
  useSetSiteModelTextMutation: api.idle,
  useSetProductAttributeMutation: () => [api.setValue, { isLoading: false }],
  useCreateAttributeOptionMutation: api.idle,
  useCreateAttributeValueOptionMutation: api.idle,
}));

const row = (overrides: Partial<SiteModelListItem>): SiteModelListItem => ({
  id: 5,
  categoryId: 3,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'accepted',
  productCount: 2,
  onSiteCount: 2,
  minPrice: null,
  photo: '',
  axes: [],
  problems: [],
  oneCCategories: [],
  ...overrides,
});

const model = {
  ...row({}),
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: null,
  products: [],
  texts: [],
  characteristics: [],
} as unknown as SiteModel;

function Address() {
  const location = useLocation();
  return <output aria-label="Адреса">{location.pathname + location.search}</output>;
}

const renderPage = (entry = '/site-models') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <SiteModelPanelsProvider>
        <Routes>
          <Route element={<SiteModelsPage />} path="/site-models" />
          <Route element={<p>Сторінка моделі</p>} path="/site-models/:id" />
        </Routes>
        <Address />
      </SiteModelPanelsProvider>
    </MemoryRouter>,
  );

const listResult = (items: SiteModelListItem[], overrides = {}) => ({
  data: { items, totalCount: items.length, page: 1, pageSize: 20 },
  isFetching: false,
  isError: false,
  refetch: api.refetch,
  ...overrides,
});

describe('SiteModelsPage', () => {
  beforeEach(() => {
    [api.list, api.change, api.create, api.refetch, api.setValue].forEach((mock) =>
      mock.mockReset(),
    );
    api.list.mockReturnValue(
      listResult([
        row({ oneCCategories: ['Накладки'] }),
        row({ id: 6, name: 'Завіса', status: 'proposed', problems: ['model_no_photo'] }),
      ]),
    );
    api.model.mockReturnValue({ data: model, isLoading: false, isError: false });
  });

  it('maps the models (SC-002)', () => {
    renderPage();
    expect(screen.getByRole('heading', { name: 'Моделі' })).toBeTruthy();
    expect(screen.queryByText(/У 1С/)).toBeNull();
    expect(screen.getByText('Не перевірена')).toBeTruthy();
    expect(screen.getByText('Немає фото')).toBeTruthy();
  });

  it('opens a model with its arrow and lists its products under the row (SC-002a)', () => {
    api.model.mockReturnValue({
      data: {
        ...model,
        products: [
          {
            productId: 101,
            name: 'Ручка Рим AB',
            photo: '',
            retailPrice: 250,
            exportToSite: true,
            values: [],
            problems: [],
          },
          {
            productId: 102,
            name: 'Ручка Рим CR',
            photo: '',
            retailPrice: null,
            exportToSite: false,
            values: [],
            problems: [],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Показати товари: Ручка Рим' }));

    expect(api.model).toHaveBeenLastCalledWith(5);
    expect(screen.getByText('Ручка Рим AB')).toBeTruthy();
    expect(screen.getByText('Код 102')).toBeTruthy();
    expect(screen.getByText('Не на сайті')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Сховати товари: Ручка Рим' }));
    expect(screen.queryByText('Ручка Рим AB')).toBeNull();
  });

  it('fixes a product colour under an opened model and opens all its attributes (SC-002b)', async () => {
    api.setValue.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    api.model.mockReturnValue({
      data: {
        ...model,
        axes: [{ attributeId: 1, code: 'color', name: 'Колір', display: 'swatch', isSaved: true }],
        products: [
          {
            productId: 101,
            name: 'Ручка Рим NM',
            photo: '',
            retailPrice: 250,
            exportToSite: true,
            values: [{ attributeId: 1, valueId: 5, name: 'Матовий нікель', isManual: false }],
            problems: [],
          },
        ],
      },
      isLoading: false,
      isError: false,
    });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Показати товари: Ручка Рим' }));
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Колір: Ручка Рим NM' }));
    fireEvent.click(screen.getByRole('option', { name: 'Нікель матовий' }));
    await waitFor(() =>
      expect(api.setValue).toHaveBeenCalledWith({
        productId: 101,
        attributeId: 1,
        input: { valueIds: [4] },
      }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Усі ознаки товару Ручка Рим NM' }));
    expect(await screen.findByText('Ознаки товару')).toBeTruthy();
  });

  it('keeps a picked filter in the address and resets the page (SC-003)', () => {
    renderPage('/site-models?page=2');
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Статус' }));
    fireEvent.click(screen.getByRole('option', { name: 'Прийняті' }));
    expect(screen.getByLabelText('Адреса').textContent).toBe('/site-models?status=accepted');
    expect(api.list).toHaveBeenLastCalledWith({ status: 'accepted', page: 1, pageSize: 20 });
  });

  it('opens a model with the eye, keeping the list address', () => {
    renderPage('/site-models?search=рим');
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути модель Завіса' }));
    expect(screen.getByText('Сторінка моделі')).toBeTruthy();
  });

  it('changes the category in the panel opened by the pencil (SC-004)', async () => {
    api.change.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати модель Ручка Рим' }));
    const panel = await screen.findByRole('dialog');
    fireEvent.mouseDown(within(panel).getByRole('combobox', { name: 'Категорія на сайті' }));
    expect(screen.queryByRole('option', { name: 'Фурнітура' })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: 'Фурнітура / Накладки' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Зберегти категорію' }));
    expect(api.change).toHaveBeenCalledWith({ id: 5, categoryId: 4 });
  });

  it('creates a model from «Нова модель» and opens it (SC-005)', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve({ id: 42 }) });
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'Нова модель' }));
    const panel = await screen.findByRole('dialog');
    fireEvent.change(within(panel).getByLabelText('Назва моделі'), { target: { value: 'Рим' } });
    fireEvent.mouseDown(within(panel).getByRole('combobox', { name: 'Категорія на сайті' }));
    fireEvent.click(screen.getByRole('option', { name: 'Фурнітура / Ручки' }));
    fireEvent.click(within(panel).getByRole('checkbox', { name: 'Ручка 11' }));
    fireEvent.click(within(panel).getByRole('checkbox', { name: 'Ручка 12' }));
    fireEvent.click(within(panel).getByRole('button', { name: 'Створити модель' }));
    await waitFor(() =>
      expect(screen.getByLabelText('Адреса').textContent).toBe('/site-models/42'),
    );
    expect(api.create).toHaveBeenCalledWith({ categoryId: 3, name: 'Рим', productIds: [11, 12] });
  });

  it('shows the empty states (SC-012)', () => {
    api.list.mockReturnValue(listResult([]));
    const { unmount } = renderPage();
    expect(screen.getByText('Моделей ще немає')).toBeTruthy();
    unmount();
    renderPage('/site-models?search=zzz');
    expect(screen.getByText('Нічого не знайдено')).toBeTruthy();
  });

  it('shows the load error and refetches with «Повторити» (SC-012)', () => {
    api.list.mockReturnValue(listResult([], { data: undefined, isError: true }));
    renderPage();
    expect(screen.getByText('Не вдалося завантажити моделі.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(api.refetch).toHaveBeenCalled();
  });
});
