import { fireEvent, render, screen } from '@testing-library/react';

import { CompanyRequisitesForm } from './company-requisites-form';

import type { CompanyRequisitesDraft } from '@admin/company/model';

const draft: CompanyRequisitesDraft = {
  legalName: 'ФОП Овчинников Максим Володимирович',
  code: '2689400771',
  registrationExtractNumber: '24800170000032534',
  iban: 'UA303052990000026007025905216',
  bankName: 'ПриватБанк',
  bankCode: '305299',
};

const renderForm = (props: Partial<Parameters<typeof CompanyRequisitesForm>[0]> = {}) => {
  const handlers = { onChange: vi.fn(), onReset: vi.fn(), onSave: vi.fn() };
  render(
    <CompanyRequisitesForm dirty={false} draft={draft} saving={false} {...handlers} {...props} />,
  );
  return handlers;
};

describe('CompanyRequisitesForm', () => {
  it('shows every field and keeps saving off until something changes', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'IBAN' })).toHaveProperty('value', draft.iban);
    expect(screen.getByRole('textbox', { name: 'МФО' })).toHaveProperty('value', '305299');
    expect(screen.getByRole('button', { name: 'Зберегти' })).toHaveProperty('disabled', true);
  });

  it('passes a typed value up and shows a field error instead of the hint', () => {
    const { onChange } = renderForm({
      dirty: true,
      errors: { bankCode: 'У цьому IBAN МФО 305299.' },
    });

    fireEvent.change(screen.getByRole('textbox', { name: 'Банк' }), { target: { value: 'Моно' } });

    expect(onChange).toHaveBeenCalledWith({ ...draft, bankName: 'Моно' });
    expect(screen.getByText('У цьому IBAN МФО 305299.')).toBeTruthy();
  });
});
