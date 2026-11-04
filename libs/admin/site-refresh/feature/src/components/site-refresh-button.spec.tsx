import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteRefreshButton } from './site-refresh-button';

const refresh = vi.hoisted(() => vi.fn());

vi.mock('@admin/site-refresh/data-access', () => ({
  useRefreshSiteMutation: () => [refresh, { isLoading: false }],
}));

const answer = (outcome: Promise<unknown>) => ({ unwrap: () => outcome });

describe('SiteRefreshButton', () => {
  beforeEach(() => refresh.mockReset());

  it('tells that the site shows the changes now', async () => {
    refresh.mockReturnValue(answer(Promise.resolve({ status: 'refreshed' })));
    render(<SiteRefreshButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Оновити сайт зараз' }));

    expect(await screen.findByText(/Сайт оновлено/)).toBeTruthy();
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  it.each([
    [503, /Сайт ще не підключено/],
    [502, /Сайт не відповів/],
    [500, /Не вдалося оновити сайт/],
  ])('explains the %i answer', async (status, text) => {
    refresh.mockReturnValue(answer(Promise.reject({ code: 'Server', status, message: 'x' })));
    render(<SiteRefreshButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Оновити сайт зараз' }));

    expect(await screen.findByText(text)).toBeTruthy();
  });
});
