import { fireEvent, render, screen } from '@testing-library/react';

import { CartHeaderButton } from './cart-header-button';

describe('cart header button', () => {
  it.each([false, true])(
    'announces real cart values and returns its actual opener (compact=%s)',
    (compact) => {
      const onOpen = vi.fn();
      render(
        <CartHeaderButton
          locale="uk"
          compact={compact}
          unitCount={17}
          goodsSubtotal={2560}
          restoring={false}
          open={false}
          onOpen={onOpen}
        />,
      );
      const button = screen.getByRole('button', { name: /Кошик: 17/ });
      expect(button.getAttribute('aria-haspopup')).toBe('dialog');
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('data-cart-trigger')).toBe(compact ? 'compact' : 'main');
      fireEvent.click(button);
      expect(onOpen).toHaveBeenCalledWith(button);
    },
  );

  it('does not announce a fabricated zero during restoration', () => {
    render(
      <CartHeaderButton
        locale="ru"
        unitCount={0}
        goodsSubtotal={0}
        restoring
        open={false}
        onOpen={vi.fn()}
      />,
    );
    const button = screen.getByRole('button', { name: /Корзина.*загрузка/ });
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.textContent).not.toContain('0');
  });
});
