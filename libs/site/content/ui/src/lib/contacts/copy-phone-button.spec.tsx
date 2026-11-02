import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CopyPhoneButton } from './copy-phone-button';

const labels = {
  uk: {
    copyLabel: 'Скопіювати номер телефону',
    copiedLabel: 'Номер скопійовано',
    errorLabel: 'Не вдалося скопіювати. Виділіть номер і скопіюйте вручну.',
  },
  ru: {
    copyLabel: 'Скопировать номер телефона',
    copiedLabel: 'Номер скопирован',
    errorLabel: 'Не удалось скопировать. Выделите номер и скопируйте вручную.',
  },
};

const setClipboard = (value: unknown) =>
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value });

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  setClipboard(undefined);
});

describe('copying the contact phone', () => {
  it('supports keyboard activation and writes the international phone', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    render(<CopyPhoneButton phone="+380687135049" {...labels.uk} />);

    await user.tab();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: labels.uk.copyLabel }));
    await user.keyboard('{Enter}');

    expect(writeText).toHaveBeenCalledExactlyOnceWith('+380687135049');
    expect(screen.getByRole('status').textContent).toBe(labels.uk.copiedLabel);
  });

  it('blocks repeated requests while pending and clears success after two seconds', async () => {
    vi.useFakeTimers();
    let finish!: () => void;
    const writeText = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    setClipboard({ writeText });
    render(<CopyPhoneButton phone="+380687135049" {...labels.uk} />);
    const button = screen.getByRole('button', { name: labels.uk.copyLabel }) as HTMLButtonElement;

    fireEvent.click(button);
    expect(button.disabled).toBe(true);
    fireEvent.click(button);
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('status').textContent).toBe('');
    await act(async () => finish());
    expect(button.disabled).toBe(false);
    expect(screen.getByRole('status').textContent).toBe(labels.uk.copiedLabel);
    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByRole('status').textContent).toBe('');
  });

  for (const [locale, text] of Object.entries(labels)) {
    it.each(['missing', 'rejected'])(
      'reports a %s clipboard in ' + locale + ' without navigation',
      async (failure) => {
        const originalUrl = window.location.href;
        setClipboard(
          failure === 'missing'
            ? undefined
            : { writeText: vi.fn().mockRejectedValue(new Error('Denied')) },
        );
        render(<CopyPhoneButton phone="+380687135049" {...text} />);

        fireEvent.click(screen.getByRole('button', { name: text.copyLabel }));
        await waitFor(() => expect(screen.getByRole('status').textContent).toBe(text.errorLabel));

        expect(screen.queryByText(text.copiedLabel)).toBeNull();
        expect(window.location.href).toBe(originalUrl);
        expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false);
      },
    );
  }

  it('allows a successful retry after an error', async () => {
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error('Denied'))
      .mockResolvedValueOnce(undefined);
    setClipboard({ writeText });
    render(<CopyPhoneButton phone="+380687135049" {...labels.ru} />);
    const button = screen.getByRole('button', { name: labels.ru.copyLabel });

    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe(labels.ru.errorLabel));
    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe(labels.ru.copiedLabel));
    expect(writeText).toHaveBeenCalledTimes(2);
  });
});
