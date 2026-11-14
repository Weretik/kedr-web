import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { PublicOfferPrintButton } from './public-offer-print-button';

import type { FormEvent } from 'react';

const translations = [
  {
    locale: 'uk',
    label: 'Друкувати',
    hint: 'Для друку документа скористайтеся командою «Друк» у меню браузера.',
  },
  {
    locale: 'ru',
    label: 'Печатать',
    hint: 'Для печати документа воспользуйтесь командой «Печать» в меню браузера.',
  },
] as const;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('public offer print action', () => {
  it.each(translations)(
    'renders a disabled control and localized no-JS hint in $locale server HTML',
    ({ label, hint }) => {
      const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
      const html = renderToString(<PublicOfferPrintButton label={label} hint={hint} />);
      const doc = new DOMParser().parseFromString(html, 'text/html');
      const control = doc.querySelector('button');

      expect(control?.textContent).toBe(label);
      expect(control?.getAttribute('type')).toBe('button');
      expect(control?.hasAttribute('disabled')).toBe(true);
      expect(doc.querySelector('noscript')?.textContent).toContain(hint);
      expect(print).not.toHaveBeenCalled();
    },
  );

  it('enables the server control after hydration without printing automatically or mismatching markup', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    const { label, hint } = translations[0];
    const container = document.createElement('div');
    container.innerHTML = renderToString(<PublicOfferPrintButton label={label} hint={hint} />);
    document.body.appendChild(container);
    const onRecoverableError = vi.fn();
    let root: ReturnType<typeof hydrateRoot> | undefined;

    try {
      expect(container.querySelector('button')?.hasAttribute('disabled')).toBe(true);
      await act(async () => {
        root = hydrateRoot(container, <PublicOfferPrintButton label={label} hint={hint} />, {
          onRecoverableError,
        });
      });
      expect(onRecoverableError).not.toHaveBeenCalled();
      const button = within(container).getByRole('button', { name: label });
      expect((button as HTMLButtonElement).disabled).toBe(false);
      expect(print).not.toHaveBeenCalled();
      fireEvent.click(button);
      expect(print).toHaveBeenCalledExactlyOnceWith();
    } finally {
      await act(async () => root?.unmount());
      container.remove();
    }
  });

  it.each(translations)(
    'prints once per $locale activation without submitting or claiming a download',
    async ({ label, hint }) => {
      const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
      const open = vi.spyOn(window, 'open').mockImplementation(() => null);
      const submit = vi.fn((event: FormEvent) => event.preventDefault());
      const initialUrl = window.location.href;
      const user = userEvent.setup();
      const { container } = render(
        <form onSubmit={submit}>
          <PublicOfferPrintButton label={label} hint={hint} />
        </form>,
      );
      const button = screen.getByRole('button', { name: label });

      expect(print).not.toHaveBeenCalled();
      await user.click(button);
      expect(print).toHaveBeenCalledExactlyOnceWith();
      await user.click(button);
      expect(print).toHaveBeenCalledTimes(2);
      expect(submit).not.toHaveBeenCalled();
      expect(open).not.toHaveBeenCalled();
      expect(window.location.href).toBe(initialUrl);
      expect(button.textContent).toBe(label);
      expect(container.querySelector('a, [download], [role="status"]')).toBeNull();
    },
  );

  it('supports native Enter and Space activation with the localized accessible name', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => undefined);
    const { label, hint } = translations[1];
    const user = userEvent.setup();
    render(<PublicOfferPrintButton label={label} hint={hint} />);
    const button = screen.getByRole('button', { name: label });

    await user.tab();
    expect(document.activeElement).toBe(button);
    await user.keyboard('{Enter}');
    expect(print).toHaveBeenCalledExactlyOnceWith();
    await user.keyboard(' ');
    expect(print).toHaveBeenCalledTimes(2);
  });
});
