import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProductsModelCell } from './products-model-cell';

describe('ProductsModelCell', () => {
  it('shows the model ID as a link that opens the model', () => {
    const onOpen = vi.fn();
    render(<ProductsModelCell modelId={42} onOpen={onOpen} />);

    fireEvent.click(screen.getByRole('button', { name: 'Відкрити модель 42' }));

    expect(screen.getByText('42')).toBeTruthy();
    expect(onOpen).toHaveBeenCalledWith(42);
  });

  it('shows a dash for a product without a model', () => {
    render(<ProductsModelCell modelId={null} onOpen={() => undefined} />);

    expect(screen.getByText('—')).toBeTruthy();
    expect(screen.queryByRole('button')).toBeNull();
  });
});
