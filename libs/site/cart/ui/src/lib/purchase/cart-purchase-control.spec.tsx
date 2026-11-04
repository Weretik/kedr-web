import { fireEvent, render, screen } from '@testing-library/react';

import { CartPurchaseControl } from './cart-purchase-control';

describe('cart purchase control', () => {
  it('keeps quantity at one until a separate add action is chosen', () => {
    const onQuantityChange = vi.fn();
    const onAdd = vi.fn();
    render(
      <CartPurchaseControl
        locale="uk"
        quantity={1}
        onQuantityChange={onQuantityChange}
        onAdd={onAdd}
        disabled={false}
        added={false}
      />,
    );
    expect(
      (screen.getByRole('button', { name: 'Зменшити кількість' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Збільшити кількість' }));
    expect(onQuantityChange).toHaveBeenCalledWith(2);
    expect(onAdd).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'У кошик' }));
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('rejects zero without deleting or silently sending the draft value', () => {
    const onQuantityChange = vi.fn();
    render(
      <CartPurchaseControl
        locale="uk"
        quantity={2}
        onQuantityChange={onQuantityChange}
        onAdd={vi.fn()}
        disabled={false}
        added={false}
      />,
    );
    const input = screen.getByRole('spinbutton', { name: 'Кількість' });
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);
    expect(onQuantityChange).not.toHaveBeenCalled();
    expect((input as HTMLInputElement).value).toBe('2');
    expect(input.getAttribute('aria-invalid')).toBe('false');
    expect(screen.getByRole('alert').textContent).toContain('від 1 до 1000');
  });

  it('shows real added feedback and disables all purchase controls when unavailable', () => {
    const onAdd = vi.fn();
    render(
      <CartPurchaseControl
        locale="ru"
        quantity={1000}
        onQuantityChange={vi.fn()}
        onAdd={onAdd}
        disabled
        added
        message="quantity-overflow"
      />,
    );
    expect((screen.getByRole('button', { name: 'Добавлено' }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Добавлено' }));
    expect(onAdd).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toContain('1000');
  });

  it('prevents quantity Enter from becoming an implicit order or add action', () => {
    const onAdd = vi.fn();
    render(
      <CartPurchaseControl
        locale="uk"
        quantity={2}
        onQuantityChange={vi.fn()}
        onAdd={onAdd}
        disabled={false}
        added={false}
      />,
    );
    expect(
      fireEvent.keyDown(screen.getByRole('spinbutton', { name: 'Кількість' }), {
        key: 'Enter',
        cancelable: true,
      }),
    ).toBe(false);
    expect(onAdd).not.toHaveBeenCalled();
  });
});
