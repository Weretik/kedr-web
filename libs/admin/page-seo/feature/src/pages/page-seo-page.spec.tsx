import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PageSeoPage } from './page-seo-page';

import type { PageSeoEntry } from '@admin/page-seo/model';

const api = vi.hoisted(() => ({ list: vi.fn(), update: vi.fn() }));

vi.mock('@admin/page-seo/data-access', () => ({
  useGetPageSeoListQuery: api.list,
  useUpdatePageSeoMutation: () => [api.update, { isLoading: false }],
}));

const empty = { titleUk: '', titleRu: '', descriptionUk: '', descriptionRu: '' };

const entries: PageSeoEntry[] = [
  { page: 'Home', label: 'Головна', path: '/', texts: empty, updatedAt: null, updatedBy: null },
  {
    page: 'Wholesale',
    label: 'Співпраця',
    path: '/wholesale',
    texts: { ...empty, titleUk: 'Фурнітура оптом' },
    updatedAt: '2026-11-05T10:00:00Z',
    updatedBy: 'Олена',
  },
];

describe('PageSeoPage', () => {
  beforeEach(() => {
    api.list
      .mockReset()
      .mockReturnValue({ data: entries, isError: false, isLoading: false, refetch: vi.fn() });
    api.update.mockReset();
  });

  it('lists the pages with the editor title or the site default', () => {
    render(<PageSeoPage />);

    expect(screen.getByText('Фурнітура оптом')).toBeDefined();
    expect(screen.getByText('Тексти сайту')).toBeDefined();
  });

  it('saves the texts of one page from the side panel', async () => {
    api.update.mockReturnValue({ unwrap: () => Promise.resolve(entries[0]) });
    render(<PageSeoPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Редагувати «Головна»' }));
    fireEvent.change(screen.getAllByRole('textbox', { name: 'SEO-заголовок' })[0], {
      target: { value: 'Дверна фурнітура в Харкові' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() => expect(api.update).toHaveBeenCalledOnce());
    expect(api.update.mock.calls[0][0]).toEqual({
      page: 'Home',
      texts: { ...empty, titleUk: 'Дверна фурнітура в Харкові' },
    });
    expect(await screen.findByText(/Сайт покаже зміни/)).toBeDefined();
  });

  it('does not save a text over the limit and keeps the panel open on a refusal', async () => {
    api.update.mockReturnValue({ unwrap: () => Promise.reject({ code: 'Validation' }) });
    render(<PageSeoPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Редагувати «Співпраця»' }));
    const title = screen.getAllByRole('textbox', { name: 'SEO-заголовок' })[1];
    fireEvent.change(title, { target: { value: 'a'.repeat(121) } });
    expect(screen.getByRole('button', { name: 'Зберегти' })).toHaveProperty('disabled', true);

    fireEvent.change(title, { target: { value: 'Фурнитура оптом' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText(/перевірте довжину/)).toBeDefined();
  });
});
