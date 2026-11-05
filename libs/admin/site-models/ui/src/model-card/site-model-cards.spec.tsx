import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelProductsCard } from './site-model-products-card';
import { SiteModelTextsCard } from './site-model-texts-card';

import type { SiteModel } from '@admin/site-models/model';

const model: SiteModel = {
  id: 3,
  categoryId: 10,
  categoryName: 'Ручки',
  name: 'Ручка Rio',
  slug: 'ruchka-rio',
  status: 'accepted',
  acceptedAt: null,
  acceptedBy: null,
  mainProductId: 7,
  axes: [{ attributeId: 1, code: 'side', name: 'Сторона', display: 'button', isSaved: true }],
  products: [
    {
      productId: 7,
      name: 'Ручка Rio L',
      slug: 'ruchka-rio-l',
      photo: '',
      retailPrice: 120,
      inStock: true,
      exportToSite: true,
      isMain: true,
      values: [{ attributeId: 1, valueId: null, name: null, isManual: false }],
      problems: ['missing_axis_value'],
    },
  ],
  texts: [],
  characteristics: [],
  problems: [],
};

describe('model card', () => {
  it('marks an empty axis value and lets a person pick it', () => {
    const onSetValue = vi.fn();
    render(
      <SiteModelProductsCard
        axes={model.axes}
        axisValues={{ 1: [{ id: 5, name: 'Ліва' }] }}
        busy={false}
        error={null}
        onAdd={vi.fn()}
        onEditAttributes={vi.fn()}
        onFillFromNames={vi.fn()}
        onRemove={vi.fn()}
        onSetValue={onSetValue}
        products={model.products}
      />,
    );

    expect(screen.getByText('Не заповнена ознака')).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Сторона: Ручка Rio L' }));
    fireEvent.click(screen.getByRole('option', { name: 'Ліва' }));
    expect(onSetValue).toHaveBeenCalledWith(7, 1, 5);
  });

  it('saves the texts of one language and shows the Google preview', async () => {
    const onSave = vi.fn().mockResolvedValue(true);
    render(<SiteModelTextsCard error={null} model={model} onSave={onSave} saving={false} />);

    expect(screen.getByText('Без SEO-заголовка')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('SEO-заголовок'), {
      target: { value: 'Ручка Rio купити' },
    });
    expect(screen.getByText('Ручка Rio купити')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith('uk', {
        shortDescription: '',
        description: '',
        seoTitle: 'Ручка Rio купити',
        seoDescription: '',
      }),
    );
  });
});
