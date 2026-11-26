import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelPicker } from './site-model-picker';

import type { SiteModelListItem } from '@admin/site-models/model';

const model = (
  id: number,
  name: string,
  status: 'accepted' | 'proposed' = 'accepted',
): SiteModelListItem => ({
  id,
  categoryId: 7,
  categoryName: 'Ручки',
  name,
  slug: 'm',
  status,
  productCount: 1,
  onSiteCount: 1,
  minPrice: null,
  photo: '',
  axes: [],
  problems: [],
  oneCCategories: [],
});

describe('SiteModelPicker', () => {
  it('sends the typed name and picks a model with its category', () => {
    const onSearchChange = vi.fn();
    const onChange = vi.fn();
    render(
      <SiteModelPicker
        loading={false}
        models={[model(1, 'Рим'), model(2, 'Мілан', 'proposed')]}
        onChange={onChange}
        onSearchChange={onSearchChange}
        search=""
        value={null}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Модель' });
    fireEvent.mouseDown(input);
    expect(screen.getByText('Ручки · не перевірена')).toBeTruthy();
    fireEvent.click(screen.getByText('Рим'));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    fireEvent.change(input, { target: { value: 'м' } });
    expect(onSearchChange).toHaveBeenCalledWith('м');
  });
});
