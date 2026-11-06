import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelAxesCard } from './site-model-axes-card';
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
    const onRemove = vi.fn();
    render(
      <SiteModelProductsCard
        axes={model.axes}
        axisValues={{ 1: [{ id: 5, name: 'Ліва' }] }}
        busy={false}
        error={null}
        onAdd={vi.fn()}
        onCreateValue={vi.fn()}
        onEditAttributes={vi.fn()}
        onFillFromNames={vi.fn()}
        onRemove={onRemove}
        onSetValue={onSetValue}
        products={model.products}
      />,
    );

    expect(screen.getByText('Не заповнена ознака')).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Сторона: Ручка Rio L' }));
    fireEvent.click(screen.getByRole('option', { name: 'Ліва' }));
    expect(onSetValue).toHaveBeenCalledWith(7, 1, 5);
    expect(screen.queryByText(/грн/)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Прибрати з моделі: Ручка Rio L' }));
    expect(onRemove).toHaveBeenCalledWith(model.products[0]);
  });

  it('creates a missing value of an axis and sets it on the product', async () => {
    const onSetValue = vi.fn();
    const onCreateValue = vi.fn().mockResolvedValue(9);
    render(
      <SiteModelProductsCard
        axes={model.axes}
        axisValues={{ 1: [{ id: 5, name: 'Ліва' }] }}
        busy={false}
        error={null}
        onAdd={vi.fn()}
        onCreateValue={onCreateValue}
        onEditAttributes={vi.fn()}
        onFillFromNames={vi.fn()}
        onRemove={vi.fn()}
        onSetValue={onSetValue}
        products={model.products}
      />,
    );

    const input = screen.getByRole('combobox', { name: 'Сторона: Ручка Rio L' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Універсальна' } });
    fireEvent.click(screen.getByRole('option', { name: '+ Створити значення «Універсальна»' }));

    await waitFor(() => expect(onSetValue).toHaveBeenCalledWith(7, 1, 9));
    expect(onCreateValue).toHaveBeenCalledWith(1, 'Універсальна');
  });

  it('creates a missing attribute and adds it as a switcher', async () => {
    const onChange = vi.fn();
    const onCreateAttribute = vi.fn().mockResolvedValue(12);
    render(
      <SiteModelAxesCard
        axes={model.axes}
        busy={false}
        error={null}
        onChange={onChange}
        onCreateAttribute={onCreateAttribute}
        options={[{ id: 2, name: 'Колір', kind: 'enum', unit: null }]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Додати ознаку' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Ознака' }), {
      target: { value: 'Пакування' },
    });
    expect(screen.queryByRole('option', { name: 'Колір' })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: '+ Створити ознаку «Пакування»' }));

    await waitFor(() => expect(onChange).toHaveBeenCalledWith([1, 12]));
    expect(onCreateAttribute).toHaveBeenCalledWith('Пакування');
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
