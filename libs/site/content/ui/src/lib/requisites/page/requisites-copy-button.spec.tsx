import { getRequisitesDictionary } from '@site/content/model';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { RequisitesCopyButton } from './requisites-copy-button';

import type { FormEvent } from 'react';

const iban = 'TEST-ua00 001';
const payload = 'Найменування: ТЕСТ «Зразок»\nКод: 000123\nIBAN: TEST-ua00 001';
const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
const execCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
  else Reflect.deleteProperty(navigator, 'clipboard');
  if (execCommandDescriptor) Object.defineProperty(document, 'execCommand', execCommandDescriptor);
  else Reflect.deleteProperty(document, 'execCommand');
});

function setClipboard(
  clipboard:
    { writeText: ReturnType<typeof vi.fn>; readText?: ReturnType<typeof vi.fn> } | undefined,
) {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: clipboard });
}

/** Records navigation at its boundary without depending on jsdom URL changes. */
function guardNavigation() {
  const actualWindow = window;
  const actualLocation = actualWindow.location;
  const attempted = vi.fn();
  const locationProxy = new Proxy({} as Location, {
    get(_target, property) {
      if (property === 'assign' || property === 'replace') {
        return (destination: unknown) => attempted('location.' + String(property), destination);
      }
      const value = Reflect.get(actualLocation, property, actualLocation);
      return typeof value === 'function' ? value.bind(actualLocation) : value;
    },
    set(_target, property, destination) {
      attempted('location.' + String(property), destination);
      return true;
    },
  });
  vi.stubGlobal(
    'window',
    new Proxy(actualWindow, {
      get(target, property) {
        if (property === 'location') return locationProxy;
        if (property === 'open') return (...args: unknown[]) => attempted('window.open', ...args);
        return Reflect.get(target, property, target);
      },
      set(target, property, destination) {
        if (property === 'location') {
          attempted('window.location', destination);
          return true;
        }
        return Reflect.set(target, property, destination, target);
      },
    }),
  );
  vi.stubGlobal('location', locationProxy);
  return attempted;
}

const cases = [
  { locale: 'uk' as const, variant: 'icon' as const, text: iban },
  { locale: 'ru' as const, variant: 'icon' as const, text: iban },
  { locale: 'uk' as const, variant: 'default' as const, text: payload },
  { locale: 'ru' as const, variant: 'default' as const, text: payload },
];

const fallbackCases = [
  { locale: 'uk' as const, variant: 'icon' as const, text: iban },
  { locale: 'ru' as const, variant: 'default' as const, text: payload },
];

function renderCopy(
  locale: 'uk' | 'ru',
  variant: 'icon' | 'default',
  text: string = variant === 'icon' ? iban : payload,
) {
  const copy = getRequisitesDictionary(locale).copy;
  const label = variant === 'icon' ? copy.iban : copy.all;
  render(
    <RequisitesCopyButton
      text={text}
      label={label}
      copiedLabel={copy.copied}
      fallbackLabel={copy.fallback}
      variant={variant}
    />,
  );
  return { copy, button: screen.getByRole('button', { name: label }) };
}

it.each(cases)(
  'writes the exact $variant payload and announces success in $locale',
  async ({ locale, variant, text }) => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const readText = vi.fn();
    setClipboard({ writeText, readText });
    const { copy, button } = renderCopy(locale, variant, text);

    expect(writeText).not.toHaveBeenCalled();
    fireEvent.click(button);

    await waitFor(() => expect(writeText).toHaveBeenCalledExactlyOnceWith(text));
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe(copy.copied));
    expect(screen.getByRole('status').getAttribute('aria-live')).toBe('polite');
    expect(button.getAttribute('aria-describedby')).toBe(screen.getByRole('status').id);
    expect(readText).not.toHaveBeenCalled();
  },
);

it.each(fallbackCases)(
  'keeps exact fallback data and permits retry after rejection in $locale',
  async ({ locale, variant, text }) => {
    const writeText = vi
      .fn()
      .mockRejectedValueOnce(new Error('Denied'))
      .mockResolvedValue(undefined);
    const readText = vi.fn();
    const execCommand = vi.fn();
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    setClipboard({ writeText, readText });
    const { copy, button } = renderCopy(locale, variant, text);
    const navigation = guardNavigation();

    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole('status').textContent).toContain(copy.fallback));
    expect(screen.getByRole('status').querySelector('span')?.textContent).toBe(text);
    expect((button as HTMLButtonElement).disabled).toBe(false);
    expect(navigation).not.toHaveBeenCalled();
    expect(readText).not.toHaveBeenCalled();
    expect(execCommand).not.toHaveBeenCalled();

    fireEvent.click(button);
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe(copy.copied));
    expect(writeText).toHaveBeenCalledTimes(2);
    expect(writeText).toHaveBeenNthCalledWith(2, text);
  },
);

it.each(fallbackCases)(
  'provides selectable $variant data without side effects when clipboard is unavailable',
  async ({ locale, variant, text }) => {
    setClipboard(undefined);
    const execCommand = vi.fn();
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand });
    const { copy, button } = renderCopy(locale, variant, text);
    const navigation = guardNavigation();

    fireEvent.click(button);

    await waitFor(() => expect(screen.getByRole('status').textContent).toContain(copy.fallback));
    expect(screen.getByRole('status').querySelector('span')?.textContent).toBe(text);
    expect(navigation).not.toHaveBeenCalled();
    expect(execCommand).not.toHaveBeenCalled();
  },
);

it('guards pending writes while keeping the two copy instances independent', async () => {
  let completeIban!: () => void;
  const writeText = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          completeIban = resolve;
        }),
    )
    .mockResolvedValue(undefined);
  setClipboard({ writeText });
  const copy = getRequisitesDictionary('uk').copy;
  render(
    <>
      <RequisitesCopyButton
        text={iban}
        label={copy.iban}
        copiedLabel={copy.copied}
        fallbackLabel={copy.fallback}
        variant="icon"
      />
      <RequisitesCopyButton
        text={payload}
        label={copy.all}
        copiedLabel={copy.copied}
        fallbackLabel={copy.fallback}
      />
    </>,
  );
  const ibanButton = screen.getByRole('button', { name: copy.iban });
  const allButton = screen.getByRole('button', { name: copy.all });
  const [ibanStatus, allStatus] = screen.getAllByRole('status');

  fireEvent.click(ibanButton);
  fireEvent.click(ibanButton);
  expect((ibanButton as HTMLButtonElement).disabled).toBe(true);
  expect(ibanButton.getAttribute('aria-busy')).toBe('true');
  expect((allButton as HTMLButtonElement).disabled).toBe(false);
  expect(writeText).toHaveBeenCalledTimes(1);
  expect(ibanStatus.id).not.toBe(allStatus.id);

  fireEvent.click(allButton);
  await waitFor(() => expect(allStatus.textContent).toBe(copy.copied));
  expect(ibanStatus.textContent).toBe('');
  expect(writeText).toHaveBeenNthCalledWith(2, payload);

  await act(async () => completeIban());
  expect((ibanButton as HTMLButtonElement).disabled).toBe(false);
  expect(ibanButton.getAttribute('aria-busy')).toBe('false');
  expect(ibanStatus.textContent).toBe(copy.copied);
});

it('supports keyboard activation with its localized accessible name', async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  setClipboard({ writeText });
  const { copy, button } = renderCopy('ru', 'icon');

  await user.tab();
  expect(document.activeElement).toBe(button);
  await user.keyboard('{Enter}');

  await waitFor(() => expect(writeText).toHaveBeenCalledExactlyOnceWith(iban));
  expect(screen.getByRole('status').textContent).toBe(copy.copied);
});

it('does not submit the surrounding form or request clipboard access before a click', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  const readText = vi.fn();
  const submitted = vi.fn((event: FormEvent) => event.preventDefault());
  setClipboard({ writeText, readText });
  const copy = getRequisitesDictionary('uk').copy;
  render(
    <form onSubmit={submitted}>
      <RequisitesCopyButton
        text={payload}
        label={copy.all}
        copiedLabel={copy.copied}
        fallbackLabel={copy.fallback}
      />
    </form>,
  );

  expect(writeText).not.toHaveBeenCalled();
  expect(readText).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', { name: copy.all }));
  await waitFor(() => expect(writeText).toHaveBeenCalledExactlyOnceWith(payload));
  expect(submitted).not.toHaveBeenCalled();
});
