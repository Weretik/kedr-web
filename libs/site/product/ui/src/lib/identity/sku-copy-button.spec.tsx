import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

import { SkuCopyButton } from './sku-copy-button';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('SkuCopyButton', () => {
  it('confirms copying only after the real clipboard promise resolves', async () => {
    let resolveCopy: (() => void) | undefined;
    const writeText = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveCopy = resolve;
        }),
    );
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    render(<SkuCopyButton locale="uk" sku="00817" />);
    fireEvent.click(screen.getByRole('button', { name: 'Скопіювати артикул' }));
    expect(writeText).toHaveBeenCalledWith('00817');
    expect(screen.getByRole('status').textContent).toBe('');
    resolveCopy?.();
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe('Артикул скопійовано'));
  });

  it('does not claim success when clipboard access fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    });
    render(<SkuCopyButton locale="ru" sku="00817" />);
    fireEvent.click(screen.getByRole('button', { name: 'Скопировать артикул' }));
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toBe(
        'Не удалось скопировать. Выделите артикул и скопируйте его.',
      ),
    );
    expect(screen.queryByText('Артикул скопирован')).toBeNull();
  });

  it('provides a text recovery when the clipboard API is not available', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
    render(<SkuCopyButton locale="uk" sku="00817" />);
    fireEvent.click(screen.getByRole('button', { name: 'Скопіювати артикул' }));
    await waitFor(() =>
      expect(screen.getByRole('status').textContent).toContain('Виділіть артикул'),
    );
  });
});
