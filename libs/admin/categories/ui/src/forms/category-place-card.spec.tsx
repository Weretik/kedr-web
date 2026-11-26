import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoryPlaceCard } from './category-place-card';
import { CategoryManualChip } from '../components/category-manual-chip';

const options = [
  { id: null, label: 'Верхній рівень', path: '' },
  { id: 1, label: 'Ручки', path: 'Ручки' },
];

const card = (overrides: Partial<Parameters<typeof CategoryPlaceCard>[0]> = {}) => {
  const props = {
    options,
    draft: 1,
    dirty: false,
    canMoveUp: false,
    canMoveDown: true,
    busy: false,
    onDraftChange: vi.fn(),
    onSave: vi.fn(),
    onMove: vi.fn(),
    ...overrides,
  };
  render(<CategoryPlaceCard {...props} />);
  return props;
};

describe('CategoryPlaceCard', () => {
  it('moves down, keeps «Вище» off for the first neighbour, saves only a changed place (SC-003)', () => {
    const props = card();
    expect(screen.getByRole('button', { name: 'Вище' }).hasAttribute('disabled')).toBe(true);
    expect(screen.getByRole('button', { name: 'Зберегти' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Нижче' }));
    expect(props.onMove).toHaveBeenCalledWith('down');
  });

  it('saves a changed place and shows the server message', () => {
    const props = card({ dirty: true, error: 'У цій категорії є моделі.' });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(props.onSave).toHaveBeenCalled();
    expect(screen.getByText('У цій категорії є моделі.')).toBeTruthy();
  });
});

describe('CategoryManualChip', () => {
  it('marks only a manual category (SC-002)', () => {
    const { rerender } = render(<CategoryManualChip isManual />);
    expect(screen.getByText('Створена вручну')).toBeTruthy();
    rerender(<CategoryManualChip isManual={false} />);
    expect(screen.queryByText('Створена вручну')).toBeNull();
  });
});
