import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { CompanyRequisitesPage } from './company-requisites-page';

import type { CompanyRequisites } from '@admin/company/model';

const api = vi.hoisted(() => ({ get: vi.fn(), history: vi.fn(), update: vi.fn() }));

vi.mock('@admin/company/data-access', () => ({
  useGetCompanyRequisitesQuery: api.get,
  useGetCompanyRequisitesHistoryQuery: api.history,
  useUpdateCompanyRequisitesMutation: () => [api.update, { isLoading: false }],
}));

const requisites: CompanyRequisites = {
  legalName: 'ФОП Овчинников Максим Володимирович',
  code: '2689400771',
  registrationExtractNumber: '24800170000032534',
  iban: 'UA303052990000026007025905216',
  bankName: 'ПриватБанк',
  bankCode: '305299',
  updatedAt: '2026-11-04T10:00:00Z',
};

const field = (name: string) => screen.getByRole('textbox', { name });

describe('CompanyRequisitesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.get.mockReturnValue({
      data: requisites,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });
    api.history.mockReturnValue({ data: [], isError: false, refetch: vi.fn() });
  });

  it('saves a new IBAN typed with spaces together with its bank code', async () => {
    api.update.mockReturnValue({ unwrap: () => Promise.resolve(requisites) });
    render(<CompanyRequisitesPage />);

    fireEvent.change(field('IBAN'), { target: { value: 'UA21 3223 1300 0002 6007 2335 6600 1' } });
    fireEvent.change(field('МФО'), { target: { value: '322313' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    await waitFor(() =>
      expect(api.update).toHaveBeenCalledWith({
        legalName: requisites.legalName,
        code: requisites.code,
        registrationExtractNumber: requisites.registrationExtractNumber,
        iban: 'UA21 3223 1300 0002 6007 2335 6600 1',
        bankName: requisites.bankName,
        bankCode: '322313',
      }),
    );
    expect(await screen.findByText(/Реквізити збережено/)).toBeTruthy();
  });

  it('stops when the bank code does not match the IBAN', () => {
    render(<CompanyRequisitesPage />);

    fireEvent.change(field('МФО'), { target: { value: '300001' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(screen.getByText('У цьому IBAN МФО 305299.')).toBeTruthy();
    expect(api.update).not.toHaveBeenCalled();
  });

  it('puts a server field error under its field', async () => {
    api.update.mockReturnValue({
      unwrap: () => Promise.reject({ code: 'Validation', fieldErrors: { iban: ['Invalid.'] } }),
    });
    render(<CompanyRequisitesPage />);

    fireEvent.change(field('Банк'), { target: { value: 'ПриватБанк АТ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));

    expect(await screen.findByText('Сервер не прийняв це значення. Перевірте його.')).toBeTruthy();
  });

  it('shows the change history next to the form', () => {
    api.history.mockReturnValue({
      data: [
        {
          id: 1,
          changedAt: '2026-11-04T10:00:00Z',
          changedBy: 'admin@classkedr.com.ua',
          changes: [{ field: 'bankName', oldValue: 'Приват', newValue: 'ПриватБанк' }],
        },
      ],
      isError: false,
      refetch: vi.fn(),
    });
    render(<CompanyRequisitesPage />);

    expect(screen.getByRole('heading', { name: 'Історія змін' })).toBeTruthy();
    expect(screen.getByText(/admin@classkedr\.com\.ua/)).toBeTruthy();
  });

  it('offers a retry when loading fails', () => {
    const refetch = vi.fn();
    api.get.mockReturnValue({ data: undefined, isLoading: false, isError: true, refetch });
    render(<CompanyRequisitesPage />);

    fireEvent.click(screen.getByRole('button', { name: 'Повторити' }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
