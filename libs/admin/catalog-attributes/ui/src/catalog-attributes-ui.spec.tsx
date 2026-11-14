import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CodeMeaningRow } from './components/codes/code-meaning-row';
import { CodeWorkspace } from './components/codes/code-workspace';
import { AttributeValueForm } from './forms/attribute-value/attribute-value-form';
import { CategoryFiltersEditor } from './forms/category-filters-editor';
import { emptyNewAttribute, toNewAttribute } from './forms/new-attribute-fields';

import type { MeaningRowSlotProps } from './components/codes/code-meanings-editor';
import type {
  CatalogAttribute,
  CatalogAttributeValue,
  CategoryFilter,
  CodeProducts,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';

const code = (aliasId: number, valueId: number | null): UnresolvedCode => ({
  aliasId,
  attributeId: 2,
  attributeName: 'Колір / декор',
  scope: 'general',
  rawValue: `C${aliasId}`,
  valueId,
  valueName: valueId === null ? null : 'Хром',
  isConfirmed: false,
  note: null,
  productCount: 4,
  meanings: [],
});

const filter = (attributeId: number, name: string): CategoryFilter => ({
  attributeId,
  code: `a${attributeId}`,
  name,
  isFilterable: true,
  sortOrder: attributeId * 10,
  isEditedManually: false,
  productCount: 3,
});

describe('catalog attributes ui', () => {
  it('creates a «Так / Ні» attribute without a unit', () => {
    expect(
      toNewAttribute({ ...emptyNewAttribute, nameUk: ' Пакування ', kind: 'yesno', unit: 'мм' }),
    ).toMatchObject({ nameUk: 'Пакування', kind: 'yesno', unit: null });
  });

  it('saves a new value with a valid color only', () => {
    const onSave = vi.fn();
    render(
      <AttributeValueForm
        error={null}
        onCancel={vi.fn()}
        onPickTexture={vi.fn()}
        onSave={onSave}
        saving={false}
        texture={null}
        value={null}
      />,
    );
    fireEvent.change(screen.getByLabelText(/Назва українською/), { target: { value: 'Бронза' } });
    fireEvent.click(screen.getByLabelText('Колір'));
    fireEvent.change(screen.getByRole('textbox', { name: 'Колір' }), { target: { value: '#B08' } });
    expect((screen.getByRole('button', { name: 'Зберегти' }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    fireEvent.change(screen.getByRole('textbox', { name: 'Колір' }), {
      target: { value: '#B08D57' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(onSave).toHaveBeenCalledWith({
      nameUk: 'Бронза',
      nameRu: null,
      sortOrder: 0,
      swatchHex: '#B08D57',
      swatchMediaFileId: null,
    });
  });

  it('uploads a picture from the computer and saves the value with it', () => {
    const onSave = vi.fn();
    const onUploadTexture = vi.fn();
    const props = {
      error: null,
      onCancel: vi.fn(),
      onPickTexture: vi.fn(),
      onSave,
      onUploadTexture,
      saving: false,
      value: null,
    };
    const { rerender } = render(<AttributeValueForm {...props} texture={null} />);
    fireEvent.change(screen.getByLabelText(/Назва українською/), { target: { value: 'Горіх' } });
    fireEvent.click(screen.getByLabelText('Картинка'));
    expect(screen.getByText('Картинку не вибрано.')).toBeTruthy();
    expect((screen.getByRole('button', { name: 'Зберегти' }) as HTMLButtonElement).disabled).toBe(
      true,
    );

    const file = new File(['x'], 'horikh.jpg', { type: 'image/jpeg' });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe('image/jpeg,image/png,image/webp');
    fireEvent.change(input, { target: { files: [file] } });
    expect(onUploadTexture).toHaveBeenCalledWith(file);

    rerender(
      <AttributeValueForm {...props} texture={{ id: 77, url: 'https://cdn/swatches/a.jpg' }} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(onSave).toHaveBeenCalledWith({
      nameUk: 'Горіх',
      nameRu: null,
      sortOrder: 0,
      swatchHex: null,
      swatchMediaFileId: 77,
    });
  });

  it('shows the products of a code by category and decides it for all and per category', () => {
    const onSave = vi.fn();
    const value = (id: number, nameUk: string, valueCode: string): CatalogAttributeValue => ({
      id,
      code: valueCode,
      nameUk,
      nameRu: null,
      slug: valueCode.toLowerCase(),
      sortOrder: 0,
      swatchHex: null,
      swatchMediaFileId: null,
      swatchImageUrl: null,
      isEditedManually: false,
      productCount: 0,
    });
    const products: CodeProducts = {
      aliasId: 1,
      rawValue: 'AL',
      categories: [
        {
          categoryId: 5915,
          categoryPath: 'Фурнітура > Ручки > На планці',
          hasOwnValue: false,
          valueId: null,
          valueName: null,
          products: [{ productId: 60, name: 'KEDR ручка R08.148-AL-SN/CP', photo: '' }],
          meanings: [],
        },
        {
          categoryId: 7,
          categoryPath: 'Міжкімнатні двері > Korfad',
          hasOwnValue: true,
          valueId: null,
          valueName: null,
          products: [{ productId: 26363, name: 'Дверне полотно ALIANO AL-06', photo: '' }],
          meanings: [],
        },
      ],
    };
    const material: CatalogAttribute = {
      id: 2,
      code: 'material_code',
      nameUk: 'Матеріал',
      nameRu: null,
      kind: 'enum',
      unit: null,
      slug: 'material',
      isFilterable: false,
      isVariantAxis: false,
      sortOrder: 0,
      isEditedManually: false,
      valueCount: 1,
      productCount: 0,
    };
    const Row = (props: MeaningRowSlotProps) => (
      <CodeMeaningRow
        {...props}
        attributes={[material]}
        creating={false}
        onCreateValue={() => Promise.resolve(undefined)}
        values={[value(5, 'Алюміній', 'ALUMINIUM')]}
        valuesLoading={false}
      />
    );
    render(
      <CodeWorkspace
        canEdit
        code={{ ...code(1, null), rawValue: 'AL', productCount: 2 }}
        error={null}
        MeaningRow={Row}
        onRetry={vi.fn()}
        onSave={onSave}
        onSkip={vi.fn()}
        products={products}
        productsError={false}
        productsLoading={false}
        saving={false}
      />,
    );

    expect(screen.getByRole('region', { name: 'Ручки > На планці' })).toBeTruthy();
    expect(screen.getAllByText('AL').some((node) => node.tagName === 'MARK')).toBe(true);
    expect(
      screen.getByRole('combobox', { name: 'Розшифровка в категорії Korfad' }).textContent,
    ).toBe('Нічого не означає');
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Значення 1 для всіх товарів' }));
    fireEvent.click(screen.getByRole('option', { name: 'Алюміній (ALUMINIUM)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти і далі' }));

    expect(onSave).toHaveBeenCalledWith({
      valueId: null,
      applyToAll: true,
      meanings: [{ attributeId: 2, valueId: 5 }],
      categories: [{ categoryId: 7, valueId: null, meanings: [] }],
    });
  });

  it('reorders and hides category filters before saving', () => {
    const onSave = vi.fn();
    render(
      <CategoryFiltersEditor
        canEdit
        error={null}
        filters={[filter(1, 'Колір'), filter(2, 'Сторона')]}
        onSave={onSave}
        saving={false}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Перемістити Сторона вище' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Показувати фільтр Колір' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(
      onSave.mock.calls[0][0].map((item: CategoryFilter) => [
        item.attributeId,
        item.sortOrder,
        item.isFilterable,
      ]),
    ).toEqual([
      [2, 10, true],
      [1, 20, false],
    ]);
  });
});
