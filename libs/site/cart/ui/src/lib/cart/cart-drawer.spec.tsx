import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { useRef, useState } from 'react';

import { CartDrawer } from './cart-drawer';
import { basketFixture } from '../test/cart.fixture';

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}));

describe('cart drawer', () => {
  it('shows real lines, unit count and goods-only total with a localized checkout link', () => {
    render(
      <CartDrawer
        {...basketFixture()}
        open
        onOpenChange={vi.fn()}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Дверна ручка')).toBeTruthy();
    expect(dialog.textContent).toContain('5 шт.');
    expect(dialog.textContent).toContain('731');
    const checkout = within(dialog).getByRole('link', { name: /Оформити замовлення/ });
    expect(checkout.getAttribute('href')).toBe('/uk/checkout');
    expect(checkout.getAttribute('rel')).toBe('nofollow');
  });

  it('changes quantity and removes only through their separate callbacks', () => {
    const basket = basketFixture({ onChangeQuantity: vi.fn(), onRemove: vi.fn() });
    render(
      <CartDrawer
        {...basket}
        open
        onOpenChange={vi.fn()}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Збільшити кількість: Дверна ручка' }));
    expect(basket.onChangeQuantity).toHaveBeenCalledWith('7', 3);
    fireEvent.click(screen.getByRole('button', { name: 'Видалити: Дверна ручка' }));
    expect(basket.onRemove).toHaveBeenCalledWith('7');
  });

  it('does not present loading as an empty basket', () => {
    render(
      <CartDrawer
        {...basketFixture({ lines: [], restoring: true })}
        open
        onOpenChange={vi.fn()}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    expect(screen.getByRole('status').textContent).toContain('Відновлюємо кошик');
    expect(screen.queryByText('Кошик порожній')).toBeNull();
    expect(screen.queryByRole('link', { name: /Оформити замовлення/ })).toBeNull();
  });

  it('offers the real catalog for an empty basket in Russian', () => {
    render(
      <CartDrawer
        {...basketFixture({ lines: [], locale: 'ru' })}
        open
        onOpenChange={vi.fn()}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    expect(screen.getByText('Корзина пуста')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Перейти в каталог/ }).getAttribute('href')).toBe(
      '/ru/catalog',
    );
    expect(screen.queryByRole('link', { name: /Оформить заказ/ })).toBeNull();
  });

  it('requires an explicit recovery decision before checkout', () => {
    const basket = basketFixture({
      recovery: { discardedCount: 2 },
      onAcceptRecovery: vi.fn(),
      onDiscardRecovery: vi.fn(),
    });
    render(
      <CartDrawer
        {...basket}
        open
        onOpenChange={vi.fn()}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    expect(screen.queryByRole('link', { name: /Оформити замовлення/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Залишити відновлені товари' }));
    expect(basket.onAcceptRecovery).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Почати з порожнього кошика' }));
    expect(basket.onDiscardRecovery).toHaveBeenCalledOnce();
  });

  it('keeps pending edits and checkout unavailable while still allowing the drawer to close', () => {
    const basket = basketFixture({ pending: true, onRemove: vi.fn() });
    const onOpenChange = vi.fn();
    render(
      <CartDrawer
        {...basket}
        open
        onOpenChange={onOpenChange}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    const remove = screen.getByRole('button', {
      name: 'Видалити: Дверна ручка',
    }) as HTMLButtonElement;
    expect(remove.disabled).toBe(true);
    fireEvent.click(remove);
    expect(basket.onRemove).not.toHaveBeenCalled();
    expect(screen.queryByRole('link', { name: /Оформити замовлення/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Закрити кошик' }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('replaces a failed real photo with a neutral fallback', () => {
    render(
      <CartDrawer
        {...basketFixture()}
        open
        onOpenChange={vi.fn()}
        onReturnFocus={vi.fn()}
        onCheckout={vi.fn()}
      />,
    );
    fireEvent.error(screen.getByRole('img', { name: 'Дверна ручка' }));
    expect(screen.queryByRole('img', { name: 'Дверна ручка' })).toBeNull();
    expect(screen.getAllByRole('img', { name: 'Фото товару відсутнє' })).toHaveLength(2);
  });

  it('closes on Escape and returns focus to the actual external opener', async () => {
    function Fixture() {
      const [open, setOpen] = useState(false);
      const opener = useRef<HTMLButtonElement>(null);
      return (
        <>
          <button type="button" ref={opener} onClick={() => setOpen(true)}>
            Open compact cart
          </button>
          <CartDrawer
            {...basketFixture()}
            open={open}
            onOpenChange={setOpen}
            onReturnFocus={() => opener.current?.focus()}
            onCheckout={vi.fn()}
          />
        </>
      );
    }
    render(<Fixture />);
    const opener = screen.getByRole('button', { name: 'Open compact cart' });
    opener.focus();
    fireEvent.click(opener);
    expect(screen.getByRole('dialog')).toBeTruthy();
    fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(opener));
  });
});
