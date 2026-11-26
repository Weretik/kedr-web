import { fireEvent, render, screen } from '@testing-library/react';

import { CompanyContactsForm } from './company-contacts-form';

import type { CompanyContactsDraft } from '@admin/company/model';

const draft: CompanyContactsDraft = {
  salesPhone: '+380687135049',
  viberPhone: '+380687135049',
  email: 'kedr.class19@gmail.com',
  telegramUrl: 'https://t.me/+380687135049',
  mapUrl: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  cityUk: 'Харків',
  cityRu: 'Харьков',
  storeName: 'Крамниця Дверна фурнітура CLASS',
  streetAddressUk: 'вул. Ахієзерів, 46',
  streetAddressRu: 'ул. Ахиезеров, 46',
  regionUk: 'Харківська обл.',
  regionRu: 'Харьковская обл.',
  postalCode: '61038',
  weekdaysOpens: '09:00',
  weekdaysCloses: '16:00',
  saturdayOpens: '',
  saturdayCloses: '',
  sundayOpens: '',
  sundayCloses: '',
};

const renderForm = (props: Partial<Parameters<typeof CompanyContactsForm>[0]> = {}) => {
  const handlers = { onChange: vi.fn(), onReset: vi.fn(), onSave: vi.fn() };
  render(
    <CompanyContactsForm dirty={false} draft={draft} saving={false} {...handlers} {...props} />,
  );
  return handlers;
};

describe('CompanyContactsForm', () => {
  it('shows every contact field and keeps saving off until something changes', () => {
    renderForm();

    expect(screen.getByRole('textbox', { name: 'Телефон відділу продажів' })).toHaveProperty(
      'value',
      '+380687135049',
    );
    for (const label of [
      'Номер для Viber',
      'Email',
      'Посилання на Telegram',
      'Посилання на карту',
      'Місто українською',
      'Місто російською',
    ])
      expect(screen.getByRole('textbox', { name: label })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Зберегти' })).toHaveProperty('disabled', true);
  });

  it('sends one field change and submits the form', () => {
    const handlers = renderForm({ dirty: true });

    fireEvent.change(screen.getByRole('textbox', { name: 'Місто українською' }), {
      target: { value: 'Київ' },
    });
    expect(handlers.onChange).toHaveBeenCalledWith({ ...draft, cityUk: 'Київ' });

    fireEvent.click(screen.getByRole('button', { name: 'Зберегти' }));
    expect(handlers.onSave).toHaveBeenCalledTimes(1);
  });

  it('edits the shop address and hours', () => {
    const handlers = renderForm({ errors: { postalCode: 'П’ять цифр, наприклад 61038.' } });

    expect(screen.getByRole('textbox', { name: 'Вулиця і будинок українською' })).toHaveProperty(
      'value',
      'вул. Ахієзерів, 46',
    );
    expect(screen.getByText('П’ять цифр, наприклад 61038.')).toBeTruthy();
    fireEvent.change(screen.getByLabelText('Субота: з'), { target: { value: '10:00' } });
    expect(handlers.onChange).toHaveBeenCalledWith({ ...draft, saturdayOpens: '10:00' });
  });

  it('puts field errors under their fields and shows the server error', () => {
    renderForm({
      dirty: true,
      errors: { email: 'Перевірте email.' },
      saveError: 'Не вдалося зберегти. Спробуйте ще раз.',
    });

    expect(screen.getByText('Перевірте email.')).toBeTruthy();
    expect(screen.getByRole('alert').textContent).toBe('Не вдалося зберегти. Спробуйте ще раз.');
  });
});
