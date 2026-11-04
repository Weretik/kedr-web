import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CartRuntime } from './cart-runtime';
import { CartHeaderAction } from '../cart/cart-header-action';
import { CheckoutController } from '../checkout/checkout-controller';
import { renderCartPurchaseAction } from '../purchase/render-cart-purchase-action';

import type { CheckoutResult } from '@site/cart/model';
import type { ComponentProps } from 'react';

const { orderAction } = vi.hoisted(() => ({ orderAction: vi.fn() }));
vi.mock('../actions/submit-quick-order', () => ({ submitQuickOrder: orderAction }));
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: ComponentProps<'a'>) => (
    <a
      {...props}
      href={href ?? '/'}
      onClick={(event) => {
        event.preventDefault();
        onClick?.(event);
      }}
    >
      {children}
    </a>
  ),
}));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

afterEach(cleanup);
const product = {
  productId: '101',
  title: 'Ручка Kedr R10',
  unitPrice: 425,
  currency: 'UAH' as const,
  slug: 'kedr-r10',
  available: true,
};

describe('app cart composition', () => {
  it('rejects unavailable and unknown-price product descriptors before creating a purchase island', () => {
    expect(renderCartPurchaseAction('uk', { ...product, available: false })).toBeNull();
    expect(renderCartPurchaseAction('uk', { ...product, unitPrice: null })).toBeNull();
    expect(renderCartPurchaseAction('uk', { ...product, unitPrice: 0 })).toBeNull();
    expect(renderCartPurchaseAction('uk', { ...product, unitPrice: Number.NaN })).toBeNull();
  });

  it('connects product, both headers, drawer and checkout to one order and confirmed receipt', async () => {
    window.localStorage.clear();
    let resolveOrder!: (value: CheckoutResult) => void;
    const response = new Promise<CheckoutResult>((resolve) => {
      resolveOrder = resolve;
    });
    orderAction.mockImplementation(() => response);
    const app = render(
      <CartRuntime locale="uk">
        <CartHeaderAction locale="uk" />
        <CartHeaderAction locale="uk" compact />
        <div data-testid="product-purchase">{renderCartPurchaseAction('uk', product)}</div>
        <div data-testid="checkout">
          <CheckoutController
            locale="uk"
            phone={{ display: '(067) 111-22-33', e164: '+380671112233' }}
          />
        </div>
      </CartRuntime>,
    );
    const producer = within(screen.getByTestId('product-purchase'));
    const add = producer.getByRole('button', { name: /У кошик/ });
    await waitFor(() => expect((add as HTMLButtonElement).disabled).toBe(false));
    expect(orderAction).not.toHaveBeenCalled();
    fireEvent.click(add);
    const headers = screen.getAllByRole('button', { name: /^Кошик:/ });
    expect(headers).toHaveLength(2);
    expect(headers.every((header) => header.getAttribute('aria-label')?.includes('1 шт.'))).toBe(
      true,
    );
    fireEvent.click(headers[0]);
    const dialog = await screen.findByRole('dialog', { name: /Кошик/ });
    const drawerQuantity = within(dialog).getByRole('spinbutton', { name: /Кількість/ });
    fireEvent.change(drawerQuantity, { target: { value: '3' } });
    expect((drawerQuantity as HTMLInputElement).value).toBe('3');
    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    const checkout = within(screen.getByTestId('checkout'));
    expect(
      (checkout.getByRole('spinbutton', { name: /Кількість/ }) as HTMLInputElement).value,
    ).toBe('3');
    fireEvent.change(checkout.getByLabelText(/Ім/), { target: { value: 'Олександр' } });
    fireEvent.change(checkout.getByLabelText(/Телефон/), { target: { value: '0687135049' } });
    const submit = checkout.getByRole('button', { name: /Надіслати замовлення/ });
    expect((submit as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(submit);
    fireEvent.submit(app.container.querySelector('form')!);
    await waitFor(() => expect(orderAction).toHaveBeenCalledTimes(1));
    expect(orderAction.mock.calls[0][0]).toEqual({
      firstName: 'Олександр',
      phone: '+38 (068) 713-50-49',
      lines: [{ productId: '101', title: product.title, unitPrice: 425, quantity: 3 }],
    });
    expect((checkout.getByLabelText(/Телефон/) as HTMLInputElement).disabled).toBe(true);
    await act(async () => {
      resolveOrder({ kind: 'created', orderId: '11111111-2222-4333-8444-555555555555' });
    });
    expect(checkout.getByText('11111111')).toBeTruthy();
    expect(checkout.queryByLabelText(/Телефон/)).toBeNull();
    expect(window.localStorage.getItem('cart_v1')).toBeNull();
    expect(orderAction).toHaveBeenCalledTimes(1);
  });
});
