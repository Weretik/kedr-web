import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SiteFinalCategorySelect } from './site-final-category-select';

const categories = [
  { id: 3, name: 'Завіси', path: 'Фурнітура / Завіси' },
  { id: 4, name: 'Ручки', path: 'Фурнітура / Ручки' },
];

describe('SiteFinalCategorySelect', () => {
  it('offers only the given final categories by path', () => {
    const onChange = vi.fn();
    render(
      <SiteFinalCategorySelect
        categories={categories}
        loading={false}
        onChange={onChange}
        value={3}
      />,
    );
    const input = screen.getByRole('combobox', { name: 'Категорія на сайті' }) as HTMLInputElement;
    expect(input.value).toBe('Фурнітура / Завіси');
    fireEvent.mouseDown(input);
    expect(screen.queryByRole('option', { name: 'Фурнітура' })).toBeNull();
    fireEvent.click(screen.getByRole('option', { name: 'Фурнітура / Ручки' }));
    expect(onChange).toHaveBeenCalledWith(4);
  });
});
