import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LoneProductModelPicker } from './lone-product-model-picker';

import type { LoneModelCandidate } from '@admin/site-models/model';

const models: LoneModelCandidate[] = [
  { id: 1, name: 'Завіса 120', categoryId: 7, status: 'accepted' },
  { id: 2, name: 'Завіса 100×75', categoryId: 7, status: 'proposed' },
];

describe('LoneProductModelPicker', () => {
  it('prefills the similar model with a note and adds the product to it', () => {
    const onAdd = vi.fn();
    render(
      <LoneProductModelPicker
        loading={false}
        models={models}
        onAdd={onAdd}
        pending={false}
        suggestedId={2}
      />,
    );
    const picker = screen.getByRole('combobox', { name: 'Модель' }) as HTMLInputElement;
    expect(picker.value).toBe('Завіса 100×75');
    expect(screen.getByText('Схожа модель за назвою — підставлено автоматично')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Додати' }));
    expect(onAdd).toHaveBeenCalledWith(2);
  });

  it('locks «Додати» without a model and while a save runs, and hides the note after a pick', () => {
    const { rerender } = render(
      <LoneProductModelPicker loading={false} models={models} onAdd={vi.fn()} pending={false} />,
    );
    expect(screen.getByRole('button', { name: 'Додати' }).hasAttribute('disabled')).toBe(true);
    expect(screen.queryByText(/підставлено автоматично/)).toBeNull();

    fireEvent.mouseDown(screen.getByRole('combobox', { name: 'Модель' }));
    const listbox = screen.getByRole('listbox');
    expect(within(listbox).getByText('Не перевірена')).toBeTruthy();
    fireEvent.click(within(listbox).getByText('Завіса 120'));
    expect(screen.getByRole('button', { name: 'Додати' }).hasAttribute('disabled')).toBe(false);

    rerender(
      <LoneProductModelPicker
        loading={false}
        models={models}
        onAdd={vi.fn()}
        pending
        suggestedId={2}
      />,
    );
    expect((screen.getByRole('combobox', { name: 'Модель' }) as HTMLInputElement).value).toBe(
      'Завіса 120',
    );
    expect(screen.queryByText(/підставлено автоматично/)).toBeNull();
    expect(screen.getByRole('button', { name: 'Додати' }).hasAttribute('disabled')).toBe(true);
  });
});
