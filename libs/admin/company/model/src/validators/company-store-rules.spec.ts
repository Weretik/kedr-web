import { validateCompanyStore } from './company-store-rules';

import type { CompanyStore } from '../entities/company-store';

const store: CompanyStore = {
  storeName: 'Крамниця Дверна фурнітура CLASS',
  streetAddressUk: 'вул. Ахієзерів, 46',
  streetAddressRu: 'ул. Ахиезеров, 46',
  regionUk: 'Харківська обл.',
  regionRu: 'Харьковская обл.',
  postalCode: '61038',
  weekdaysOpens: '9:00',
  weekdaysCloses: '16:00',
  saturdayOpens: '',
  saturdayCloses: '',
  sundayOpens: '',
  sundayCloses: '',
};

const errorsOf = (patch: Partial<CompanyStore>) =>
  Object.fromEntries(
    Object.entries(validateCompanyStore({ ...store, ...patch })).filter(([, error]) => error),
  );

describe('company store rules', () => {
  it('accepts the shop, an empty shop, and days off', () => {
    expect(errorsOf({})).toEqual({});
    const empty = Object.fromEntries(Object.keys(store).map((key) => [key, ''])) as CompanyStore;
    expect(errorsOf(empty)).toEqual({});
  });

  it('checks the postal code and text lengths', () => {
    expect(errorsOf({ postalCode: '6103' })).toEqual({
      postalCode: 'П’ять цифр, наприклад 61038.',
    });
    expect(errorsOf({ regionUk: 'x'.repeat(81) })).toEqual({ regionUk: 'Не більше 80 символів.' });
  });

  it('wants both times of a day, valid, and closing after opening', () => {
    expect(errorsOf({ saturdayCloses: '14:00' })).toEqual({
      saturdayOpens: 'Вкажіть час відкриття, наприклад 9:00.',
    });
    expect(errorsOf({ weekdaysCloses: '25:00' })).toEqual({
      weekdaysCloses: 'Вкажіть час закриття, наприклад 16:00.',
    });
    expect(errorsOf({ weekdaysCloses: '9:00' })).toEqual({
      weekdaysCloses: 'Магазин має закриватися пізніше.',
    });
  });
});
