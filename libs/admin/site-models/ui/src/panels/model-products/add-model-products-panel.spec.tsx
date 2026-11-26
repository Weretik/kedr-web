import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AddModelProductsPanel } from './add-model-products-panel';

import type { SiteProductCandidate } from '@admin/site-models/model';

const candidate = (
  productId: number,
  overrides: Partial<SiteProductCandidate> = {},
): SiteProductCandidate => ({
  productId,
  name: `Товар ${productId}`,
  photo: '',
  categoryName: 'Накладки',
  note: 'без моделі',
  disabledReason: null,
  ...overrides,
});

describe('AddModelProductsPanel', () => {
  it('adds the picked products, with the search of the whole catalog', () => {
    const onAdd = vi.fn();
    const onSearchChange = vi.fn();
    render(
      <AddModelProductsPanel
        candidates={[candidate(1), candidate(2)]}
        error="Товар уже в іншій моделі"
        loading={false}
        onAdd={onAdd}
        onClose={vi.fn()}
        open
        saving={false}
        search={{ value: '', scope: 'free', onSearchChange, onScopeChange: vi.fn() }}
        subtitle="Модель «Рим»"
      />,
    );
    expect(screen.getByText('Модель «Рим»')).toBeTruthy();
    expect(screen.getByText('Товар уже в іншій моделі')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Пошук товарів'), { target: { value: 'рим' } });
    expect(onSearchChange).toHaveBeenCalledWith('рим');
    expect((screen.getByRole('button', { name: 'Додати' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    fireEvent.click(screen.getByText('Товар 2'));
    fireEvent.click(screen.getByRole('button', { name: 'Додати (1)' }));
    expect(onAdd).toHaveBeenCalledWith([2]);
  });

  it('lists the given candidates without the search', () => {
    render(
      <AddModelProductsPanel
        candidates={[]}
        error={null}
        loading={false}
        onAdd={vi.fn()}
        onClose={vi.fn()}
        open
        saving={false}
        subtitle="Модель «Рим»"
      />,
    );
    expect(screen.queryByLabelText('Пошук товарів')).toBeNull();
    expect(screen.getByText('Немає товарів поза прийнятими моделями.')).toBeTruthy();
  });
});
