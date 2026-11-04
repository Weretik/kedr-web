import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CheckoutPage } from './checkout-page';
import { getBrowserCartStore } from '../state/browser-cart-store';

import type { Locale } from '@site/core/i18n';

const { connectionMock } = vi.hoisted(() => ({
  connectionMock: vi.fn(() => new Promise<void>(() => {})),
}));

vi.mock('next/server', () => ({ connection: connectionMock }));

const privateName = 'Приватний Покупець';
const privatePhone = '+38 (050) 123-45-67';
const privateTitle = 'Приватний товар із кошика';
const productId = 'checkout-server-frame-test';

afterEach(() => {
  vi.restoreAllMocks();
  const store = getBrowserCartStore();
  store?.remove(productId);
  store?.setDraft('firstName', '');
  store?.setDraft('phone', '');
  window.localStorage.clear();
});

describe('CheckoutPage neutral server frame', () => {
  it.each<{
    locale: Locale;
    heading: string;
    restoring: string;
  }>([
    { locale: 'uk', heading: 'Оформлення замовлення', restoring: 'Відновлюємо кошик…' },
    { locale: 'ru', heading: 'Оформление заказа', restoring: 'Восстанавливаем корзину…' },
  ])(
    'renders only the $locale heading and restoring fallback before the request leaf',
    ({ locale, heading, restoring }) => {
      connectionMock.mockClear();
      const store = getBrowserCartStore();
      store?.initialize();
      store?.add({
        productId,
        title: privateTitle,
        unitPrice: 125,
        currency: 'UAH',
        slug: 'private-product',
        available: true,
      });
      store?.setDraft('firstName', privateName);
      store?.setDraft('phone', privatePhone);

      const denyStorage = () => {
        throw new Error('Storage must not be accessed during server frame rendering');
      };
      const reads = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denyStorage);
      const writes = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(denyStorage);
      const removals = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(denyStorage);
      const clears = vi.spyOn(Storage.prototype, 'clear').mockImplementation(denyStorage);

      const markup = renderToStaticMarkup(<CheckoutPage locale={locale} />);
      const frame = document.createElement('div');
      frame.innerHTML = markup;

      const headings = frame.querySelectorAll('h1');
      expect(headings).toHaveLength(1);
      expect(headings[0].textContent).toBe(heading);
      expect(headings[0].closest('header')).not.toBeNull();

      const fallback = frame.querySelector('[role="status"][aria-busy="true"]');
      expect(fallback).not.toBeNull();
      expect(fallback?.textContent).toContain(restoring);
      expect(fallback?.querySelector('h1')).toBeNull();
      expect(fallback?.contains(headings[0])).toBe(false);
      expect(frame.querySelector('input, textarea, select, form')).toBeNull();
      expect(markup).not.toContain(privateName);
      expect(markup).not.toContain(privatePhone);
      expect(markup).not.toContain(privateTitle);
      expect(markup).not.toMatch(
        /\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/i,
      );
      expect(connectionMock).toHaveBeenCalled();
      expect(reads).not.toHaveBeenCalled();
      expect(writes).not.toHaveBeenCalled();
      expect(removals).not.toHaveBeenCalled();
      expect(clears).not.toHaveBeenCalled();
    },
  );
});
