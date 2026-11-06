import { fireEvent, render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CatalogDictionaryTab } from './catalog-dictionary-tab';

import type { CatalogDictionaryTabProps } from './catalog-dictionary-tab';
import type { CatalogAttribute, CatalogAttributeDetails } from '@admin/catalog-attributes/model';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  one: vi.fn(),
  codes: vi.fn(),
  update: vi.fn(),
  create: vi.fn(),
  updateValue: vi.fn(),
  decide: vi.fn(),
}));

vi.mock('@admin/catalog-attributes/data-access', () => ({
  useGetCatalogAttributesQuery: api.list,
  useGetCatalogAttributeQuery: api.one,
  useGetUnresolvedCodesQuery: api.codes,
  useGetCategoryFiltersQuery: () => ({ data: undefined, isError: false, isLoading: false }),
  useUpdateCatalogAttributeMutation: () => [api.update, { isLoading: false }],
  useCreateCatalogAttributeMutation: () => [api.create, { isLoading: false }],
  useCreateAttributeValueMutation: () => [vi.fn(), { isLoading: false }],
  useUpdateAttributeValueMutation: () => [api.updateValue, { isLoading: false }],
  useDecideAttributeCodeMutation: () => [api.decide, { isLoading: false }],
  useSetCategoryFiltersMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock('@admin/site-models/data-access', () => ({
  useGetSiteModelCategoriesQuery: () => ({
    data: [
      { id: 1, name: 'Замки', parentId: null, filterCount: 0 },
      { id: 2, name: 'Сувальдні', parentId: 1, filterCount: 3 },
      { id: 3, name: 'Накладні', parentId: 1, filterCount: 0 },
    ],
    isError: false,
    isLoading: false,
  }),
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

/** The page of «Вітрина сайту» holds «Нова ознака» and the notice; this harness stands in for it. */
function Harness({ canEdit, tab }: Pick<CatalogDictionaryTabProps, 'canEdit' | 'tab'>) {
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  return (
    <>
      {canEdit ? <button onClick={() => setCreating(true)}>Нова ознака</button> : null}
      <CatalogDictionaryTab
        canEdit={canEdit}
        creating={creating}
        onCreatingChange={setCreating}
        onNotice={setNotice}
        tab={tab}
      />
      {notice ? <p>{notice}</p> : null}
    </>
  );
}

const renderPage = (canEdit: boolean, tab: CatalogDictionaryTabProps['tab'] = 'attributes') =>
  render(<Harness canEdit={canEdit} tab={tab} />);

describe('CatalogDictionaryTab', () => {
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

  it('lets an admin create an attribute and opens it', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve(details) });
    renderPage(true);
    fireEvent.click(screen.getByRole('button', { name: 'Нова ознака' }));
    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));
    expect(api.create).not.toHaveBeenCalled();
    expect(screen.getByText('Вкажіть назву до 120 символів.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/Назва українською/), {
      target: { value: 'Матеріал ручки' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Створити' }));
    expect(api.create).toHaveBeenCalledWith({
      nameUk: 'Матеріал ручки',
      nameRu: null,
      kind: 'enum',
      unit: null,
      isFilterable: true,
      isVariantAxis: false,
      sortOrder: 100,
    });
    expect(await screen.findByText('Ознаку створено.')).toBeTruthy();
    expect(screen.getByText('Редагування ознаки')).toBeTruthy();
  });

  it('shows a manager the attribute read-only', () => {
    renderPage(false);
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути властивість Колір / декор' }));
    expect(screen.queryByLabelText(/Назва українською/)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Додати' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Нова ознака' })).toBeNull();
  });

  it('shows the codes tab', () => {
    renderPage(true, 'codes');
    expect(screen.getByText('Нерозшифрованих кодів немає.')).toBeTruthy();
  });

  it('edits a value right in the list of the panel', async () => {
    api.updateValue.mockReturnValue({ unwrap: () => Promise.resolve(details.values[0]) });
    renderPage(true);
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати властивість Колір / декор' }));
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати значення Хром' }));
    const form = screen.getByRole('form', { name: 'Значення Хром' });
    expect(screen.queryByRole('dialog', { name: 'Хром' })).toBeNull();
    fireEvent.change(within(form).getByLabelText(/Назва українською/), {
      target: { value: 'Хром полірований' },
    });
    fireEvent.click(within(form).getByRole('button', { name: 'Зберегти' }));
    expect(api.updateValue).toHaveBeenCalledWith(
      expect.objectContaining({
        attributeId: 3,
        valueId: 8,
        change: expect.objectContaining({ nameUk: 'Хром полірований' }),
      }),
    );
    expect(await screen.findByText('Значення збережено.')).toBeTruthy();
  });

  it('decides a code in the side panel', async () => {
    api.codes.mockReturnValue({
      data: [
        {
          aliasId: 4,
          attributeId: 3,
          attributeName: 'Колір',
          scope: 'general',
          rawValue: 'ZCN',
          valueId: null,
          valueName: null,
          isConfirmed: false,
          note: null,
          productCount: 9,
        },
      ],
      isError: false,
      isFetching: false,
    });
    api.decide.mockReturnValue({
      unwrap: () => Promise.resolve({ code: {}, valuesConfirmed: 9 }),
    });
    renderPage(true, 'codes');
    fireEvent.click(screen.getByRole('button', { name: 'Розшифрувати код ZCN' }));
    expect(screen.getByText('«ZCN» у ознаці «Колір»')).toBeTruthy();
    fireEvent.click(screen.getByRole('radio', { name: /Хром \(CR\)/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти для 9 тов.' }));
    expect(api.decide).toHaveBeenCalledWith({ aliasId: 4, decision: { valueId: 8 } });
  });

  it('lists only categories shown on the site and marks a final one without filters', () => {
    renderPage(true, 'filters');
    expect(screen.getByText('Накладні')).toBeTruthy();
    expect(screen.getAllByText('без фільтрів')).toHaveLength(1);
    fireEvent.click(screen.getByText('Сувальдні'));
    expect(screen.getByText('Замки › Сувальдні')).toBeTruthy();
  });
});
