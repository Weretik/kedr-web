import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SiteRedirectsPage } from './site-redirects-page';

const api = vi.hoisted(() => ({
  list: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));

vi.mock('@admin/site-redirects/data-access', () => ({
  useGetSiteRedirectsQuery: api.list,
  useCreateSiteRedirectMutation: () => [api.create, { isLoading: false }],
  useUpdateSiteRedirectMutation: () => [api.update, { isLoading: false }],
  useDeleteSiteRedirectMutation: () => [api.remove, { isLoading: false }],
}));

const row = {
  id: 7,
  from: '/uk/old',
  to: '/uk/new',
  updatedAt: '2026-11-26T10:00:00Z',
  updatedBy: 'seo@kedr',
  version: 4,
};

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/site-redirects']}>
      <SiteRedirectsPage />
    </MemoryRouter>,
  );

describe('SiteRedirectsPage', () => {
  beforeEach(() => {
    const data = { items: [row], totalCount: 1 };
    api.list.mockReset().mockReturnValue({
      data,
      currentData: data,
      isError: false,
      isFetching: false,
      isLoading: false,
      refetch: vi.fn(),
    });
    api.create.mockReset();
    api.update.mockReset();
    api.remove.mockReset();
  });

  it('asks the list for page 1 of 25 and shows the rows', () => {
    renderPage();

    expect(api.list).toHaveBeenCalledWith({ page: 1, pageSize: 25 });
    expect(screen.getByText('/uk/old')).toBeDefined();
  });

  it('adds a redirect from the side panel', async () => {
    api.create.mockReturnValue({ unwrap: () => Promise.resolve(row) });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Додати переадресацію' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Стара адреса' }), {
      target: { value: '/uk/stara' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Нова адреса' }), {
      target: { value: '/uk/nova' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(api.create).toHaveBeenCalledWith({ from: '/uk/stara', to: '/uk/nova' }),
    );
    await waitFor(() => expect(screen.getByText(/протягом 5 хвилин/)).toBeDefined());
  });

  it('changes a redirect with the version it read and shows a server refusal', async () => {
    api.update.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Validation', message: 'x', fieldErrors: { to: ['Ланцюжок.'] } }),
    });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Редагувати переадресацію /uk/old' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Нова адреса' }), {
      target: { value: '/uk/other' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(api.update).toHaveBeenCalledWith({
        id: 7,
        draft: { from: '/uk/old', to: '/uk/other' },
        version: 4,
      }),
    );
    expect(await screen.findByText('Ланцюжок.')).toBeDefined();
  });

  it('deletes a redirect after the question', async () => {
    api.remove.mockReturnValue({ unwrap: () => Promise.resolve(null) });
    renderPage();

    fireEvent.click(screen.getByRole('button', { name: 'Видалити переадресацію /uk/old' }));
    fireEvent.click(screen.getByRole('button', { name: 'Видалити' }));

    await waitFor(() => expect(api.remove).toHaveBeenCalledWith(7));
  });
});
