import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelProductsPreview } from './site-model-products-preview';

import type { SiteModelPreviewEditing } from './site-model-preview-item';
import type { SiteModelProduct } from '@admin/site-models/model';

const product: SiteModelProduct = {
  productId: 7,
  name: 'Ручка Rio NM',
  slug: 'ruchka-rio-nm',
  photo: '',
  retailPrice: 250,
  inStock: true,
  exportToSite: true,
  isMain: true,
  values: [{ attributeId: 1, valueId: 5, name: 'Матовий нікель', isManual: false }],
  problems: [],
};

const editing = (overrides: Partial<SiteModelPreviewEditing> = {}): SiteModelPreviewEditing => ({
  axes: [{ attributeId: 1, code: 'color', name: 'Колір', display: 'swatch', isSaved: true }],
  axisValues: {
    1: [
      { id: 4, name: 'Нікель матовий' },
      { id: 5, name: 'Матовий нікель' },
    ],
  },
  busy: false,
  error: null,
  onSetValue: vi.fn(),
  onCreateValue: vi.fn(),
  onEditAttributes: vi.fn(),
  ...overrides,
});

const renderPreview = (props: Partial<Parameters<typeof SiteModelProductsPreview>[0]> = {}) =>
  render(
    <SiteModelProductsPreview
      error={false}
      loading={false}
      onRetry={vi.fn()}
      products={[product]}
      {...props}
    />,
  );

describe('SiteModelProductsPreview', () => {
  it('shows the products only, without pickers, when nothing can be edited (SC-002a)', () => {
    renderPreview();
    expect(screen.getByText('Ручка Rio NM')).toBeTruthy();
    expect(screen.getByText('250 грн')).toBeTruthy();
    expect(screen.queryByRole('combobox')).toBeNull();
  });

  it('changes a product colour in its picker and opens all its attributes (SC-002b)', () => {
    const edit = editing();
    renderPreview({ editing: edit });

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Колір: Ручка Rio NM' }));
    fireEvent.click(screen.getByRole('option', { name: 'Нікель матовий' }));
    expect(edit.onSetValue).toHaveBeenCalledWith(7, 1, 4);

    fireEvent.click(screen.getByRole('button', { name: 'Усі ознаки товару Ручка Rio NM' }));
    expect(edit.onEditAttributes).toHaveBeenCalledWith(product);
  });

  it('shows a save error above the products', () => {
    renderPreview({ editing: editing({ error: 'Не вдалося зберегти.' }) });
    expect(screen.getByText('Не вдалося зберегти.')).toBeTruthy();
  });
});
