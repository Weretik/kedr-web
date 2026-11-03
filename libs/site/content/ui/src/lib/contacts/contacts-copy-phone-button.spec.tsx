import { getContactsDictionary } from '@site/content/model';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ContactsCopyPhoneButton } from './contacts-copy-phone-button';

const number = '+380687135049';
const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

afterEach(() => {
  vi.unstubAllGlobals();
  cleanup();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

function setClipboard(clipboard: { writeText: ReturnType<typeof vi.fn> } | undefined) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard });
}

/** Records attempted navigation even when jsdom cannot change the document URL. */
function guardNavigationAttempts() {
  const originalWindow = window;
  const originalLocation = originalWindow.location;
  const attempted = vi.fn();
  const guardedLocation = new Proxy({} as Location, {
    get(_target, property) {
      if (property === 'assign' || property === 'replace') {
        return (destination: unknown) => attempted(`location.${property}`, destination);
      }
      const value = Reflect.get(originalLocation, property, originalLocation);
      return typeof value === 'function' ? value.bind(originalLocation) : value;
    },
    set(_target, property, destination) {
      attempted(`location.${String(property)}`, destination);
      return true;
    },
  });
  const guardedWindow = new Proxy(originalWindow, {
    get(target, property) {
      if (property === 'location') return guardedLocation;
      if (property === 'open') {
        return (...args: unknown[]) => {
          attempted('window.open', ...args);
          return null;
        };
      }
      return Reflect.get(target, property, target);
    },
    set(target, property, destination) {
      if (property === 'location') {
        attempted('window.location', destination);
        return true;
      }
      return Reflect.set(target, property, destination, target);
    },
  });
  vi.stubGlobal('window', guardedWindow);
  vi.stubGlobal('location', guardedLocation);
  return attempted;
}

function renderCopy(locale: 'uk' | 'ru') {
  const dictionary = getContactsDictionary(locale);
  render(
    <ContactsCopyPhoneButton
      e164={number}
      copyLabel={dictionary.copyLabel}
      copiedLabel={dictionary.copiedLabel}
      fallbackLabel={dictionary.copyFallbackLabel}
    />,
  );
  return dictionary;
}

it.each(['uk', 'ru'] as const)(
  'copies the international number and announces success in %s',
  async (locale) => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard({ writeText });
    const dictionary = renderCopy(locale);

    fireEvent.click(screen.getByRole('button', { name: dictionary.copyLabel }));

    await waitFor(() => expect(writeText).toHaveBeenCalledExactlyOnceWith(number));
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(dictionary.copiedLabel),
    );
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
  },
);

it.each(['uk', 'ru'] as const)(
  'offers the selectable number without navigation when clipboard is unavailable in %s',
  async (locale) => {
    setClipboard(undefined);
    const dictionary = renderCopy(locale);
    const navigationAttempt = guardNavigationAttempts();

    fireEvent.click(screen.getByRole('button', { name: dictionary.copyLabel }));

    await waitFor(() => {
      const status = screen.getByRole('status');
      expect(status.textContent).toContain(dictionary.copyFallbackLabel);
      expect(status.textContent).toContain(number);
    });
    expect(navigationAttempt).not.toHaveBeenCalled();
  },
);

it.each(['uk', 'ru'] as const)(
  'recovers from rejected clipboard access and permits a retry in %s',
  async (locale) => {
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error('Permission denied'))
      .mockResolvedValue(undefined);
    setClipboard({ writeText });
    const dictionary = renderCopy(locale);
    const button = screen.getByRole('button', { name: dictionary.copyLabel });
    const navigationAttempt = guardNavigationAttempts();

    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toContain(dictionary.copyFallbackLabel),
    );
    expect(screen.getByRole('status').textContent).toContain(number);
    expect((button as HTMLButtonElement).disabled).toBe(false);
    expect(navigationAttempt).not.toHaveBeenCalled();

    fireEvent.click(button);
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(dictionary.copiedLabel),
    );
    expect(writeText).toHaveBeenCalledTimes(2);
  },
);

it('records each navigation boundary instead of relying on jsdom URL changes', () => {
  const navigationAttempt = guardNavigationAttempts();
  const destination = 'tel:' + number;

  Reflect.set(window, 'location', destination);
  window.location.href = destination;
  location.assign(destination);
  location.replace(destination);
  window.open(destination, '_self');

  expect(navigationAttempt.mock.calls).toEqual([
    ['window.location', destination],
    ['location.href', destination],
    ['location.assign', destination],
    ['location.replace', destination],
    ['window.open', destination, '_self'],
  ]);
});

it('prevents a second clipboard request while pending and enables the next request afterwards', async () => {
  let finishCopy!: () => void;
  const writeText = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          finishCopy = resolve;
        }),
    )
    .mockResolvedValue(undefined);
  setClipboard({ writeText });
  const dictionary = renderCopy('uk');
  const button = screen.getByRole('button', { name: dictionary.copyLabel });

  fireEvent.click(button);
  expect((button as HTMLButtonElement).disabled).toBe(true);
  expect(button.getAttribute('aria-busy')).toBe('true');
  fireEvent.click(button);
  expect(writeText).toHaveBeenCalledTimes(1);

  await act(async () => finishCopy());
  expect((button as HTMLButtonElement).disabled).toBe(false);
  fireEvent.click(button);
  await waitFor(() => expect(writeText).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(button.getAttribute('aria-busy')).toBe('false'));
});

it('supports native keyboard activation with the localized accessible name', async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  setClipboard({ writeText });
  const dictionary = renderCopy('ru');
  const button = screen.getByRole('button', { name: dictionary.copyLabel });

  await user.tab();
  expect(document.activeElement).toBe(button);
  await user.keyboard('{Enter}');
  await waitFor(() => expect(writeText).toHaveBeenCalledExactlyOnceWith(number));
  await waitFor(() => expect(screen.getByRole('status').textContent).toBe(dictionary.copiedLabel));
});
