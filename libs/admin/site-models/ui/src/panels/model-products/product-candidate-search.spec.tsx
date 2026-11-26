import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductCandidateSearch } from './product-candidate-search';

describe('ProductCandidateSearch', () => {
  it('types the search and switches between free and all products', () => {
    const onSearchChange = vi.fn();
    const onScopeChange = vi.fn();
    render(
      <ProductCandidateSearch
        onScopeChange={onScopeChange}
        onSearchChange={onSearchChange}
        scope="free"
        value=""
      />,
    );
    fireEvent.change(screen.getByLabelText('Пошук товарів'), { target: { value: '123' } });
    expect(onSearchChange).toHaveBeenCalledWith('123');
    expect(
      screen.getByRole('button', { name: 'Вільні (без моделі)' }).getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: 'Усі товари' }));
    expect(onScopeChange).toHaveBeenCalledWith('all');
    fireEvent.click(screen.getByRole('button', { name: 'Вільні (без моделі)' }));
    expect(onScopeChange).toHaveBeenCalledTimes(1);
  });
});
