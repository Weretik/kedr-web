import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryMoveDialog } from './category-move-dialog';

const options = [
  { id: null, label: 'Верхній рівень', path: '' },
  { id: 1, label: 'Фурнітура', path: 'Фурнітура' },
];

const renderDialog = (dirty: boolean, onSubmit = vi.fn()) =>
  render(
    <CategoryMoveDialog
      busy={false}
      categoryName="Замки"
      dirty={dirty}
      draft={1}
      error="Не вдалося перемістити категорію."
      onClose={vi.fn()}
      onDraftChange={vi.fn()}
      onSubmit={onSubmit}
      open
      options={options}
    />,
  );

describe('CategoryMoveDialog', () => {
  it('moves only after a new parent is chosen (SC-006)', () => {
    const onSubmit = vi.fn();
    const { unmount } = renderDialog(false, onSubmit);
    const move = screen.getByRole('button', { name: 'Перемістити' }) as HTMLButtonElement;
    expect(move.disabled).toBe(true);
    unmount();

    renderDialog(true, onSubmit);
    expect(screen.getByRole('dialog', { name: /Перемістити категорію/ })).toBeTruthy();
    expect(screen.getByDisplayValue('Фурнітура')).toBeTruthy();
    expect(screen.getByText('Не вдалося перемістити категорію.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Перемістити' }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
