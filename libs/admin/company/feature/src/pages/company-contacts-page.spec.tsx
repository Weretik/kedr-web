import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CompanyContactsPage } from './company-contacts-page';

import type { CompanyContacts } from '@admin/company/model';

const api = vi.hoisted(() => ({ get: vi.fn(), update: vi.fn() }));

vi.mock('@admin/company/data-access', () => ({
  useGetCompanyContactsQuery: api.get,
  useUpdateCompanyContactsMutation: () => [api.update, { isLoading: false }],
}));

const contacts: CompanyContacts = {
  salesPhone: '+380687135049',
  viberPhone: '+380687135049',
  email: 'kedr.class19@gmail.com',
  telegramUrl: 'https://t.me/+380687135049',
  mapUrl: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  cityUk: 'Харків',
  cityRu: 'Харьков',
  updatedAt: '2026-11-04T10:00:00Z',
  updatedBy: 'manager@classkedr.com.ua',
};

const field = (name: string) => screen.getByRole('textbox', { name });

describe('CompanyContactsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockReturnValue({ data: contacts, isLoading: false, isError: false, refetch: vi.fn() });
  });

  it('saves a changed phone typed with spaces', async () => {
    api.update.mockReturnValue({ unwrap: () => Promise.resolve(contacts) });
    render(<CompanyContactsPage />);

    fireEvent.change(field('Телефон відділу продажів'), { target: { value: '067 111 22 33' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(api.update).toHaveBeenCalledWith({
        salesPhone: '067 111 22 33',
        viberPhone: contacts.viberPhone,
        email: contacts.email,
        telegramUrl: contacts.telegramUrl,
        mapUrl: contacts.mapUrl,
        cityUk: contacts.cityUk,
        cityRu: contacts.cityRu,
      }),
    );
    expect(await screen.findByText(/Контакти збережено/)).toBeTruthy();
  });

  it('stops on a local error without calling the server', () => {
    render(<CompanyContactsPage />);

    fireEvent.change(field('Email'), { target: { value: 'kedr.gmail.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(screen.getByText('Перевірте email.')).toBeTruthy();
    expect(api.update).not.toHaveBeenCalled();
  });

  it('puts a server field error under its field', async () => {
    api.update.mockReturnValue({
      unwrap: () =>
        Promise.reject({ code: 'Validation', fieldErrors: { mapUrl: ['Must be https.'] } }),
    });
    render(<CompanyContactsPage />);

    fireEvent.change(field('Місто російською'), { target: { value: 'Киев' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Сервер не прийняв це значення. Перевірте його.')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toContain('Сервер не прийняв дані');
  });

  it('shows who saved the contacts last', () => {
    render(<CompanyContactsPage />);

    expect(screen.getByText(/^Змінено: .* · manager@classkedr\.com\.ua$/)).toBeTruthy();
  });

  it('offers a retry when loading fails', () => {
    const refetch = vi.fn();
    api.get.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
    render(<CompanyContactsPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
