import { validateCompanyContactsDraft } from './company-contacts-rules';
import { normalizeUaPhone } from '../forms/company-contacts-draft';

import type { CompanyContactsDraft } from '../forms/company-contacts-draft';

const valid: CompanyContactsDraft = {
  salesPhone: '+380687135049',
  viberPhone: '+380687135049',
  email: 'kedr.class19@gmail.com',
  telegramUrl: 'https://t.me/+380687135049',
  mapUrl: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  cityUk: 'Харків',
  cityRu: 'Харьков',
};

describe('company contacts rules', () => {
  it.each([
    ['068 713 50 49', '+380687135049'],
    ['(068) 713-50-49', '+380687135049'],
    ['380687135049', '+380687135049'],
    [' +380687135049 ', '+380687135049'],
    ['12345', '12345'],
  ])('normalizes %s to %s', (input, expected) => {
    expect(normalizeUaPhone(input)).toBe(expected);
  });

  it('accepts the current contacts and a phone typed with spaces', () => {
    expect(validateCompanyContactsDraft(valid)).toBeUndefined();
    expect(validateCompanyContactsDraft({ ...valid, salesPhone: '068 713 50 49' })).toBeUndefined();
  });

  it('names every empty field', () => {
    const empty = Object.fromEntries(
      Object.keys(valid).map((key) => [key, ' ']),
    ) as CompanyContactsDraft;
    expect(validateCompanyContactsDraft(empty)).toEqual({
      salesPhone: 'Вкажіть номер.',
      viberPhone: 'Вкажіть номер.',
      email: 'Вкажіть email.',
      telegramUrl: 'Вкажіть посилання на Telegram.',
      mapUrl: 'Вкажіть посилання на карту.',
      cityUk: 'Вкажіть місто.',
      cityRu: 'Вкажіть місто.',
    });
  });

  it('rejects a foreign phone, a bad email, plain http and a non-Telegram link', () => {
    expect(
      validateCompanyContactsDraft({
        ...valid,
        salesPhone: '+48123456789',
        email: 'kedr.gmail.com',
        mapUrl: 'http://maps.example.com',
        telegramUrl: 'https://example.com/kedr',
      }),
    ).toEqual({
      salesPhone: 'Український номер, наприклад 068 713 50 49.',
      email: 'Перевірте email.',
      mapUrl: 'Посилання має починатися з https://',
      telegramUrl: 'Посилання на Telegram: https://t.me/…',
    });
  });
});
