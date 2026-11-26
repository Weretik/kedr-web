import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NewSiteModelPanel } from './new-site-model-panel';

import type { ComponentProps } from 'react';

const categories = [
  { id: 3, name: 'Завіси', path: 'Фурнітура / Завіси' },
  { id: 4, name: 'Ручки', path: 'Фурнітура / Ручки' },
];

const props = (overrides: Partial<ComponentProps<typeof NewSiteModelPanel>> = {}) => ({
  open: true,
  name: '',
  categoryId: undefined,
  categories,
  categoriesLoading: false,
  search: { value: '', scope: 'free' as const, onSearchChange: vi.fn(), onScopeChange: vi.fn() },
  candidates: [
    {
      productId: 11,
      name: 'Ручка хром',
      photo: '',
      categoryName: 'Ручки',
      note: 'без моделі',
      disabledReason: null,
    },
  ],
  candidatesLoading: false,
  selected: [],
  saving: false,
  error: null,
  onNameChange: vi.fn(),
  onCategoryChange: vi.fn(),
  onToggle: vi.fn(),
  onClose: vi.fn(),
  onSubmit: vi.fn(),
  ...overrides,
});

describe('NewSiteModelPanel', () => {
  it('locks «Створити модель» without a name or a category', () => {
    const { rerender } = render(<NewSiteModelPanel {...props({ name: 'Рим' })} />);
    const create = () =>
      screen.getByRole('button', { name: 'Створити модель' }) as HTMLButtonElement;
    expect(create().disabled).toBe(true);
    rerender(<NewSiteModelPanel {...props({ categoryId: 3 })} />);
    expect(create().disabled).toBe(true);
  });

  it('creates with a name, a category and the picked products', () => {
    const onSubmit = vi.fn();
    const onToggle = vi.fn();
    render(
      <NewSiteModelPanel
        {...props({
          name: 'Рим',
          categoryId: 3,
          selected: [{ productId: 11, name: 'Ручка хром' }],
          onSubmit,
          onToggle,
          error: 'Не вдалося зберегти.',
        })}
      />,
    );
    expect(screen.getByText('Товари (1)')).toBeTruthy();
    expect((screen.getByRole('checkbox', { name: 'Ручка хром' }) as HTMLInputElement).checked).toBe(
      true,
    );
    expect(screen.getByText('Не вдалося зберегти.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Створити модель' }));
    expect(onSubmit).toHaveBeenCalled();
    fireEvent.click(screen.getByTestId('CancelIcon'));
    expect(onToggle).toHaveBeenCalledWith({ productId: 11, name: 'Ручка хром' });
  });
});
