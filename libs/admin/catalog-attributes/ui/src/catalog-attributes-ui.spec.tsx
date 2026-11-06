import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CodeWorkspace } from './components/codes/code-workspace';
import { AttributeValueForm } from './forms/attribute-value-form';
import { CategoryFiltersEditor } from './forms/category-filters-editor';

import type {
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
        },
        {
          categoryId: 7,
          categoryPath: 'Міжкімнатні двері > Korfad',
          hasOwnValue: true,
          valueId: null,
          valueName: null,
          products: [{ productId: 26363, name: 'Дверне полотно ALIANO AL-06', photo: '' }],
        },
      ],
    };
    render(
      <CodeWorkspace
        canEdit
        code={{ ...code(1, null), rawValue: 'AL', productCount: 2 }}
        error={null}
        onRetry={vi.fn()}
        onSave={onSave}
        onSkip={vi.fn()}
        products={products}
        productsError={false}
        productsLoading={false}
        saving={false}
        values={[value(5, 'Алюміній', 'ALUMINIUM')]}
      />,
    );

    expect(screen.getByRole('region', { name: 'Ручки > На планці' })).toBeTruthy();
    expect(screen.getAllByText('AL').some((node) => node.tagName === 'MARK')).toBe(true);
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Значення для всіх товарів' }));
    fireEvent.click(screen.getByRole('option', { name: 'Алюміній (ALUMINIUM)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти і далі' }));

    expect(onSave).toHaveBeenCalledWith({
      valueId: 5,
      applyToAll: true,
      categories: [{ categoryId: 7, valueId: null }],
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
