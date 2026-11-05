import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AttributeValueDialog } from './dialogs/attribute-value-dialog';
import { CategoryFiltersEditor } from './forms/category-filters-editor';
import { UnresolvedCodesDataGrid } from './tables/unresolved-codes-data-grid';

import type { CategoryFilter, UnresolvedCode } from '@admin/catalog-attributes/model';

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
      <AttributeValueDialog
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

  it('marks undecoded codes and guesses, and lets only admins decide', () => {
    const { rerender } = render(
      <UnresolvedCodesDataGrid
        canEdit
        error={false}
        loading={false}
        onDecide={vi.fn()}
        onRetry={vi.fn()}
        rows={[code(1, null), code(2, 5)]}
      />,
    );
    expect(screen.getByText('Не розшифровано')).toBeTruthy();
    expect(screen.getByText('Припущення: Хром')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Розшифрувати код C1' })).toBeTruthy();

    rerender(
      <UnresolvedCodesDataGrid
        canEdit={false}
        error={false}
        loading={false}
        onDecide={vi.fn()}
        onRetry={vi.fn()}
        rows={[code(1, null)]}
      />,
    );
    expect(screen.queryByRole('button', { name: /Розшифрувати/ })).toBeNull();
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
