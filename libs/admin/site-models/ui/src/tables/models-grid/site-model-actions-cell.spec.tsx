import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelActionsCell } from './site-model-actions-cell';

import type { SiteModelListItem } from '@admin/site-models/model';

const siteModelListItem = (overrides: Partial<SiteModelListItem> = {}): SiteModelListItem => ({
  id: 5,
  categoryId: 7,
  categoryName: 'Ручки',
  name: 'Ручка Рим',
  slug: 'ruchka-rym',
  status: 'accepted',
  productCount: 3,
  onSiteCount: 2,
  minPrice: 100,
  photo: '',
  axes: [],
  problems: [],
  oneCCategories: [],
  ...overrides,
});

describe('SiteModelActionsCell', () => {
  it('opens the model with the eye and the edit panel with the pencil', () => {
    const onView = vi.fn();
    const onEdit = vi.fn();
    const model = siteModelListItem();
    render(<SiteModelActionsCell model={model} onEdit={onEdit} onView={onView} />);
    fireEvent.click(screen.getByRole('button', { name: 'Переглянути модель Ручка Рим' }));
    fireEvent.click(screen.getByRole('button', { name: 'Редагувати модель Ручка Рим' }));
    expect(onView).toHaveBeenCalledWith(model);
    expect(onEdit).toHaveBeenCalledWith(model);
  });

  it('has no pencil without an edit action', () => {
    render(<SiteModelActionsCell model={siteModelListItem()} onView={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /Редагувати/ })).toBeNull();
  });
});
