import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryAddModelsDialog } from './category-add-models-dialog';
import { CategorySiteModelsCard } from '../components/category-site-models-card';

const models = [
  { id: 5, name: 'Ручка Рим', isProposed: false, productCount: 3, categoryName: 'Ручки' },
  { id: 6, name: 'Ручка Альфа', isProposed: true, productCount: 1, categoryName: 'Інше' },
  { id: 7, name: 'Ручка Бета', isProposed: false, productCount: 2, categoryName: 'Інше' },
];

describe('CategorySiteModelsCard', () => {
  it('lists the models with links and opens «Додати моделі» (SC-004)', () => {
    const onAdd = vi.fn();
    render(
      <CategorySiteModelsCard
        error={false}
        loading={false}
        models={models.slice(0, 2)}
        onAdd={onAdd}
        onRetry={vi.fn()}
      />,
    );
    expect(screen.getByText('Моделі на сайті · 2')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Ручка Рим' }).getAttribute('href')).toBe(
      '/site-models/5',
    );
    expect(screen.getByText('Не перевірена')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Додати моделі' }));
    expect(onAdd).toHaveBeenCalled();
  });
});

describe('CategoryAddModelsDialog', () => {
  it('locks the models already here and adds the picked ones (SC-004)', () => {
    const onToggle = vi.fn();
    const onSubmit = vi.fn();
    render(
      <CategoryAddModelsDialog
        categoryName="Накладні"
        loading={false}
        models={models}
        onClose={vi.fn()}
        onSearchChange={vi.fn()}
        onSubmit={onSubmit}
        onToggle={onToggle}
        open
        presentIds={new Set([5])}
        saving={false}
        search=""
        selectedIds={new Set([6, 7])}
      />,
    );
    expect(screen.getByText('Вже тут')).toBeTruthy();
    expect((screen.getByRole('checkbox', { name: 'Ручка Рим' }) as HTMLInputElement).checked).toBe(
      true,
    );
    fireEvent.click(screen.getByText('Ручка Альфа'));
    expect(onToggle).toHaveBeenCalledWith(6);
    fireEvent.click(screen.getByRole('button', { name: 'Додати (2)' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
