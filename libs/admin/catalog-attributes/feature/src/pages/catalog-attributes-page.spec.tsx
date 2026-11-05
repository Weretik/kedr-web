import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CatalogAttributesPage } from './catalog-attributes-page';

import type { CatalogAttribute, CatalogAttributeDetails } from '@admin/catalog-attributes/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  one: vi.fn(),
  codes: vi.fn(),
  update: vi.fn(),
}));

vi.mock('@admin/catalog-attributes/data-access', () => ({
  useGetCatalogAttributesQuery: api.list,
  useGetCatalogAttributeQuery: api.one,
  useGetUnresolvedCodesQuery: api.codes,
  useGetFilterCategoriesQuery: () => ({ data: [], isError: false, isFetching: false }),
  useGetCategoryFiltersQuery: () => ({ data: undefined, isError: false, isLoading: false }),
  useUpdateCatalogAttributeMutation: () => [api.update, { isLoading: false }],
  useCreateAttributeValueMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateAttributeValueMutation: () => [vi.fn(), { isLoading: false }],
  useDecideAttributeCodeMutation: () => [vi.fn(), { isLoading: false }],
  useSetCategoryFiltersMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/media/data-access', () => ({
  useGetMediaFilesQuery: () => ({ data: undefined, isError: false, isFetching: false }),
}));

const attribute: CatalogAttribute = {
  id: 3,
  code: 'color',
  nameUk: 'Колір / декор',
  nameRu: null,
  kind: 'enum',
  unit: null,
  slug: 'kolir',
  isFilterable: true,
  isVariantAxis: true,
  sortOrder: 10,
  isEditedManually: false,
  valueCount: 1,
  productCount: 40,
};

const details: CatalogAttributeDetails = {
  attribute,
  values: [
    {
      id: 8,
      code: 'CR',
      nameUk: 'Хром',
      nameRu: null,
      slug: 'khrom',
      sortOrder: 10,
      swatchHex: '#C0C0C0',
      swatchMediaFileId: null,
      swatchImageUrl: null,
      isEditedManually: false,
      productCount: 40,
    },
  ],
  aliases: [
    { id: 4, scope: 'general', rawValue: 'CP', valueId: 8, isConfirmed: false, note: null },
  ],
};

const renderPage = (canEdit: boolean, entry = '/catalog-attributes') =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <CatalogAttributesPage canEdit={canEdit} />
    </MemoryRouter>,
  );

describe('CatalogAttributesPage', () => {
  beforeEach(() => {
    Object.values(api).forEach((mock) => mock.mockReset());
    api.list.mockReturnValue({ data: [attribute], isError: false, isFetching: false });
    api.one.mockReturnValue({ data: details, isError: false, isLoading: false });
    api.codes.mockReturnValue({ data: [], isError: false, isFetching: false });
    api.update.mockReturnValue({ unwrap: () => Promise.resolve(details) });
  });

  it('lets an admin rename an attribute in the side panel', async () => {
    renderPage(true);
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати властивість Колір / декор' }));
    const name = screen.getByLabelText(/Назва українською/);
    fireEvent.change(name, { target: { value: 'Колір' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(api.update).toHaveBeenCalledWith({
      id: 3,
      change: { nameUk: 'Колір', nameRu: null, isFilterable: true, sortOrder: 10 },
    });
    expect(await screen.findByText('Властивість збережено.')).toBeTruthy();
    expect(screen.getByText('Не підтверджено')).toBeTruthy();
  });

  it('shows a manager the attribute read-only', () => {
    renderPage(false);
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути властивість Колір / декор' }));
    expect(screen.queryByLabelText(/Назва українською/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Додати' })).toBeNull();
  });

  it('opens the codes tab from the address', () => {
    renderPage(true, '/catalog-attributes?tab=codes');
    expect(screen.getByRole('tab', { name: 'Не розшифровані коди', selected: true })).toBeTruthy();
    expect(screen.getByText('Нерозшифрованих кодів немає.')).toBeTruthy();
  });
});
