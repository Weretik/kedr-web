import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductCandidateList } from './product-candidate-list';

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

describe('ProductCandidateList', () => {
  it('shows the 1C code and category and locks a product of another accepted model', () => {
    const onToggle = vi.fn();
    render(
      <ProductCandidateList
        candidates={[candidate(1), candidate(2, { disabledReason: 'Уже в моделі «Рим»' })]}
        emptyText="Порожньо"
        loading={false}
        onToggle={onToggle}
        selectedIds={[1]}
      />,
    );
    expect(screen.getByText('Код 1С 1 · Накладки · без моделі')).toBeTruthy();
    expect(screen.getByText('Код 1С 2 · Накладки · Уже в моделі «Рим»')).toBeTruthy();
    expect((screen.getByRole('checkbox', { name: 'Товар 1' }) as HTMLInputElement).checked).toBe(
      true,
    );
    fireEvent.click(screen.getByText('Товар 1'));
    expect(onToggle).toHaveBeenCalledWith(expect.objectContaining({ productId: 1 }));
    expect(
      screen.getByText('Товар 2').closest('[role="button"]')?.getAttribute('aria-disabled'),
    ).toBe('true');
  });

  it('shows loading and the empty text', () => {
    const { rerender } = render(
      <ProductCandidateList
        candidates={[]}
        emptyText="Порожньо"
        loading
        onToggle={vi.fn()}
        selectedIds={[]}
      />,
    );
    expect(screen.getByLabelText('Завантаження товарів')).toBeTruthy();
    rerender(
      <ProductCandidateList
        candidates={[]}
        emptyText="Порожньо"
        loading={false}
        onToggle={vi.fn()}
        selectedIds={[]}
      />,
    );
    expect(screen.getByText('Порожньо')).toBeTruthy();
  });
});
