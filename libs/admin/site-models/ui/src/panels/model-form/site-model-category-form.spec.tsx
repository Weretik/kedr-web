import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteModelCategoryForm } from './site-model-category-form';

const categories = [
  { id: 3, name: 'Завіси', path: 'Фурнітура / Завіси' },
  { id: 4, name: 'Ручки', path: 'Фурнітура / Ручки' },
];

describe('SiteModelCategoryForm', () => {
  it('saves another category; a proposal says it will be accepted', () => {
    const onSubmit = vi.fn();
    render(
      <SiteModelCategoryForm
        categories={categories}
        error={null}
        initialCategoryId={3}
        loading={false}
        onSubmit={onSubmit}
        proposed
        saving={false}
      />,
    );
    expect(screen.getByText(/Пропозицію буде погоджено/)).toBeTruthy();
    const save = screen.getByRole('button', { name: 'Зберегти категорію' }) as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    expect(screen.getByText('Модель уже в цій категорії.')).toBeTruthy();
    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Категорія на сайті' }));
    fireEvent.click(screen.getByRole('option', { name: 'Фурнітура / Ручки' }));
    expect(screen.queryByText('Модель уже в цій категорії.')).toBeNull();
    fireEvent.click(save);
    expect(onSubmit).toHaveBeenCalledWith(4);
  });

  it('shows the server error', () => {
    render(
      <SiteModelCategoryForm
        categories={categories}
        error="Модель створюється лише в кінцевій категорії."
        initialCategoryId={3}
        loading={false}
        onSubmit={vi.fn()}
        proposed={false}
        saving={false}
      />,
    );
    expect(screen.getByText('Модель створюється лише в кінцевій категорії.')).toBeTruthy();
    expect(screen.queryByText(/Пропозицію/)).toBeNull();
  });
});
