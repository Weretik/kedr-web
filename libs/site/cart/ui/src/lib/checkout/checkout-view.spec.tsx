import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CheckoutHeading } from './checkout-heading';
import { CheckoutLoading } from './checkout-loading';
import { CheckoutView } from './checkout-view';
import { checkoutFixture } from '../testing/cart.fixture';

vi.mock('next/image', () => ({
  default: ({ src, alt, onError }: { src: string; alt: string; onError?: () => void }) => (
    <img src={src} alt={alt} onError={onError} />
  ),
}));

describe('checkout presentation', () => {
  it.each([
    ['uk', 'Ім’я', 'Телефон', 'Надіслати замовлення'],
    ['ru', 'Имя', 'Телефон', 'Отправить заказ'],
  ] as const)(
    'renders only the supported contact fields and localized routes in %s',
    (locale, name, phone, submit) => {
      render(<CheckoutView {...checkoutFixture({ locale })} />);
      expect(screen.getByRole('textbox', { name }).getAttribute('autocomplete')).toBe('given-name');
      expect(screen.getByRole('textbox', { name: phone }).getAttribute('autocomplete')).toBe('tel');
      expect(screen.getAllByRole('textbox')).toHaveLength(2);
      expect(screen.getByRole('button', { name: submit })).toBeTruthy();
      expect(screen.getByRole('link', { name: /оферт/ }).getAttribute('href')).toBe(
        `/${locale}/public-offer`,
      );
      expect(screen.queryByRole('heading', { level: 1 })).toBeNull();
    },
  );

  it('calls the sales phone passed from the admin contacts', () => {
    render(<CheckoutView {...checkoutFixture()} />);

    for (const link of screen.getAllByRole('link', { name: '(067) 111-22-33' }))
      expect(link.getAttribute('href')).toBe('tel:+380671112233');
  });

  it('forwards contact changes, blur and one explicit form submit', () => {
    const props = checkoutFixture({
      onDraftChange: vi.fn(),
      onFieldBlur: vi.fn(),
      onSubmit: vi.fn(),
    });
    render(<CheckoutView {...props} />);
    const name = screen.getByRole('textbox', { name: 'Ім’я' });
    fireEvent.change(name, { target: { value: 'Андрій' } });
    fireEvent.blur(name);
    expect(props.onDraftChange).toHaveBeenCalledWith('firstName', 'Андрій');
    expect(props.onFieldBlur).toHaveBeenCalledWith('firstName');
    fireEvent.submit(screen.getByRole('form'));
    expect(props.onSubmit).toHaveBeenCalledOnce();
  });

  it('associates translated errors with fields and escapes unknown server strings', () => {
    render(
      <CheckoutView
        {...checkoutFixture({
          locale: 'ru',
          canSubmit: false,
          fieldErrors: {
            firstName: ['too-short'],
            phone: ['invalid-phone', '<script>unsafe()</script>'],
          },
        })}
      />,
    );
    const name = screen.getByRole('textbox', { name: 'Имя' });
    const errors = document.getElementById(name.getAttribute('aria-describedby')!);
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(errors?.textContent).toContain('от 3 до 30');
    expect(screen.getByText('<script>unsafe()</script>')).toBeTruthy();
    expect(document.querySelector('script')).toBeNull();
  });

  it('blocks contact and basket edits plus Enter submission while pending', () => {
    const props = checkoutFixture({ pending: true, canSubmit: true, onSubmit: vi.fn() });
    render(<CheckoutView {...props} />);
    screen
      .getAllByRole('textbox')
      .forEach((input) => expect((input as HTMLInputElement).disabled).toBe(true));
    expect(
      (screen.getByRole('button', { name: 'Надсилаємо…' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (screen.getByRole('button', { name: 'Видалити: Дверна ручка' }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.submit(screen.getByRole('form'));
    expect(props.onSubmit).not.toHaveBeenCalled();
  });

  it('keeps restoring distinct from empty and omits the form for an empty basket', () => {
    const { rerender } = render(
      <CheckoutView {...checkoutFixture({ lines: [], restoring: true })} />,
    );
    expect(screen.getByRole('status').textContent).toContain('Відновлюємо кошик');
    expect(screen.queryByText('Кошик порожній')).toBeNull();
    rerender(<CheckoutView {...checkoutFixture({ lines: [] })} />);
    expect(screen.getByText('Кошик порожній')).toBeTruthy();
    expect(screen.queryByRole('form')).toBeNull();
  });

  it('requires recovery acknowledgement even when the controller canSubmit is true', () => {
    const props = checkoutFixture({
      recovery: { discardedCount: null },
      canSubmit: true,
      onSubmit: vi.fn(),
      onAcceptRecovery: vi.fn(),
    });
    render(<CheckoutView {...props} />);
    expect(screen.getByRole('alert').textContent).toContain('відновити');
    expect(
      (screen.getByRole('button', { name: 'Надіслати замовлення' }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.submit(screen.getByRole('form'));
    expect(props.onSubmit).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Залишити відновлені товари' }));
    expect(props.onAcceptRecovery).toHaveBeenCalledOnce();
  });

  it.each([
    ['validation', 'Перевірте дані замовлення'],
    ['conflict', 'потребують уточнення'],
    ['uncertain', 'Замовлення могло надійти'],
  ] as const)('shows a meaningful %s result even without server messages', (resultKind, text) => {
    render(<CheckoutView {...checkoutFixture({ resultKind })} />);
    expect(screen.getByRole('alert').textContent).toContain(text);
  });

  it('shows the actual receipt before the cleared empty basket', () => {
    render(
      <CheckoutView
        {...checkoutFixture({
          lines: [],
          resultKind: 'created',
          receipt: {
            orderId: 'c268a89b-f9b4-4378-aaf9-3cb33557ec85',
            unitCount: 5,
            goodsSubtotal: 731,
          },
        })}
      />,
    );
    expect(screen.getByText('C268A89B')).toBeTruthy();
    expect(screen.queryByText('Кошик порожній')).toBeNull();
    expect(screen.queryByRole('form')).toBeNull();
    expect(screen.getByRole('link', { name: /Перейти в каталог/ }).getAttribute('href')).toBe(
      '/uk/catalog',
    );
  });

  it('presents storage restrictions without disabling a valid in-memory basket', () => {
    render(<CheckoutView {...checkoutFixture({ storageIssue: 'unavailable' })} />);
    expect(screen.getByRole('alert').textContent).toContain('вкладці');
    expect(
      (screen.getByRole('button', { name: 'Надіслати замовлення' }) as HTMLButtonElement).disabled,
    ).toBe(false);
  });

  it('keeps the accepted receipt visible when removing persisted basket data fails', () => {
    render(
      <CheckoutView
        {...checkoutFixture({
          lines: [],
          resultKind: 'created',
          storageIssue: 'remove-failed',
          receipt: {
            orderId: 'c268a89b-f9b4-4378-aaf9-3cb33557ec85',
            unitCount: 5,
            goodsSubtotal: 731,
          },
        })}
      />,
    );
    expect(screen.getByText('C268A89B')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain(
      'попередні товари можуть з’явитися знову',
    );
    expect(screen.queryByRole('form')).toBeNull();
    expect(screen.queryByText('Кошик порожній')).toBeNull();
  });

  it('translates command codes and renders unknown form messages as plain text', () => {
    render(
      <CheckoutView
        {...checkoutFixture({
          formMessages: [
            'invalid-command',
            'invalid-line',
            'duplicate-product',
            'empty-cart',
            '<img src=x onerror=unsafe()>',
          ],
        })}
      />,
    );
    const alert = screen.getByRole('alert');
    expect(alert.textContent).toContain('Перевірте дані замовлення');
    expect(alert.textContent).toContain('Додайте товари');
    expect(alert.textContent).not.toContain('invalid-line');
    expect(alert.textContent).not.toContain('duplicate-product');
    expect(alert.querySelector('img')).toBeNull();
    expect(screen.getByText('<img src=x onerror=unsafe()>')).toBeTruthy();
  });

  it('preserves supplied legacy titles and contact values when the locale changes', () => {
    const props = checkoutFixture();
    const title = 'Ручка дверна з довгою підтвердженою назвою виробника та повною характеристикою';
    props.lines[0]!.snapshot.title = title;
    const { rerender } = render(<CheckoutView {...props} />);
    rerender(<CheckoutView {...props} locale="ru" />);
    expect(screen.getByRole('link', { name: title })).toBeTruthy();
    expect((screen.getByRole('textbox', { name: 'Имя' }) as HTMLInputElement).value).toBe(
      props.draft.firstName,
    );
    expect((screen.getByRole('textbox', { name: 'Телефон' }) as HTMLInputElement).value).toBe(
      props.draft.phone,
    );
  });

  it('renders a server-safe heading and a neutral server loading fallback', () => {
    const heading = renderToStaticMarkup(<CheckoutHeading locale="ru" />);
    expect(heading).toContain('<h1');
    expect(heading).toContain('Оформление заказа');
    expect(heading).toContain('/ru/catalog');
    const loading = renderToStaticMarkup(<CheckoutLoading locale="uk" />);
    expect(loading).toContain('Відновлюємо кошик');
    expect(loading).not.toContain('<h1');
  });
});
