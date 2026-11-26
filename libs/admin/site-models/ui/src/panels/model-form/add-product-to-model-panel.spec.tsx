import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AddProductToModelPanel } from './add-product-to-model-panel';

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

const picker = (value: SiteModelListItem | null) => ({
  models: [model(1, 'Рим')],
  loading: false,
  search: '',
  value,
  onSearchChange: vi.fn(),
  onChange: vi.fn(),
});

describe('AddProductToModelPanel', () => {
  it('locks «Додати» until a model is picked, then adds to it', () => {
    const onSubmit = vi.fn();
    const onNewModel = vi.fn();
    const props = {
      error: null,
      onClose: vi.fn(),
      onNewModel,
      onSubmit,
      open: true,
      saving: false,
      subtitle: 'Ручка · Код 1С 11',
    };
    const { rerender } = render(<AddProductToModelPanel {...props} picker={picker(null)} />);
    expect((screen.getByRole('button', { name: 'Додати' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    rerender(<AddProductToModelPanel {...props} picker={picker(model(1, 'Рим'))} />);
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    fireEvent.click(screen.getByRole('button', { name: 'Створити нову модель' }));
    expect(onNewModel).toHaveBeenCalled();
  });
});
