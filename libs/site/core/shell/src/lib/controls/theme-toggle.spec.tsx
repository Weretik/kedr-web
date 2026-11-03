import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { ThemeToggle } from './theme-toggle';

const { theme } = vi.hoisted(() => ({ theme: { resolvedTheme: 'light', setTheme: vi.fn() } }));
vi.mock('next-themes', () => ({ useTheme: () => theme }));

describe('ThemeToggle', () => {
  beforeEach(() => {
    theme.resolvedTheme = 'light';
    theme.setTheme.mockReset();
  });

  it.each([
    ['light', false, 'dark'],
    ['dark', true, 'light'],
  ] as const)(
    'reports the resolved %s theme and switches to its opposite',
    (current, checked, next) => {
      theme.resolvedTheme = current;
      render(<ThemeToggle label="Темна тема" />);
      const control = screen.getByRole('switch', { name: 'Темна тема' });
      expect(control.getAttribute('aria-checked')).toBe(String(checked));
      expect(control.textContent).toBe('');
      expect(control.querySelectorAll('svg')).toHaveLength(2);
      fireEvent.click(control);
      expect(theme.setTheme).toHaveBeenCalledWith(next);
    },
  );

  it('reflects a system theme change while the control remains mounted', () => {
    const { rerender } = render(<ThemeToggle label="Тёмная тема" />);
    theme.resolvedTheme = 'dark';
    rerender(<ThemeToggle label="Тёмная тема" />);
    expect(screen.getByRole('switch').getAttribute('aria-checked')).toBe('true');
  });

  it('has stable disabled markup on the server until the saved theme is known', () => {
    theme.resolvedTheme = 'dark';
    const html = renderToString(<ThemeToggle label="Темна тема" />);
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const control = doc.querySelector('[role="switch"]');
    expect(control?.hasAttribute('disabled')).toBe(true);
    expect(control?.getAttribute('aria-checked')).toBe('false');
  });
});

it('hydrates a saved dark theme without a server/client mismatch', async () => {
  theme.resolvedTheme = 'dark';
  const container = document.createElement('div');
  container.innerHTML = renderToString(<ThemeToggle label="Темна тема" />);
  document.body.appendChild(container);
  const onRecoverableError = vi.fn();
  let hydratedRoot: ReturnType<typeof hydrateRoot> | undefined;
  try {
    await act(async () => {
      hydratedRoot = hydrateRoot(container, <ThemeToggle label="Темна тема" />, {
        onRecoverableError,
      });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    const control = within(container).getByRole('switch');
    expect(control.hasAttribute('disabled')).toBe(false);
    expect(control.getAttribute('aria-checked')).toBe('true');
  } finally {
    await act(async () => hydratedRoot?.unmount());
    container.remove();
  }
});
