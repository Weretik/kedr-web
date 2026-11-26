import { mapCompanyContacts, toSaveCompanyContactsBody } from './company-contacts.mapper';

const dto = {
  salesPhone: '+380687135049',
  email: 'kedr.class19@gmail.com',
  telegramUrl: 'https://t.me/+380687135049',
  viberPhone: '+380687135049',
  mapUrl: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  cityUk: 'Харків',
  cityRu: 'Харьков',
  store: {
    storeName: 'Крамниця Дверна фурнітура CLASS',
    streetAddressUk: 'вул. Ахієзерів, 46',
    streetAddressRu: null,
    regionUk: 'Харківська обл.',
    regionRu: null,
    postalCode: '61038',
    weekdaysOpens: '09:00',
    weekdaysCloses: '16:00',
    saturdayOpens: null,
    saturdayCloses: null,
    sundayOpens: null,
    sundayCloses: null,
  },
  updatedAt: '2026-11-04T00:00:00Z',
};

describe('company contacts mapper', () => {
  it('reads the response and rejects a broken one', () => {
    const contacts = mapCompanyContacts(dto);
    expect(contacts.updatedBy).toBeNull();
    expect(contacts.store.streetAddressUk).toBe('вул. Ахієзерів, 46');
    expect(contacts.store.saturdayOpens).toBe('');
    expect(mapCompanyContacts({ ...dto, updatedBy: 'a@b.c' }).updatedBy).toBe('a@b.c');
    expect(() => mapCompanyContacts({ ...dto, email: null })).toThrow();
  });

  it('trims the body and normalizes both phones', () => {
    expect(
      toSaveCompanyContactsBody({
        salesPhone: '068 111 22 33',
        viberPhone: '(050) 444-55-66',
        email: ' sales@example.test ',
        telegramUrl: ' https://t.me/kedr ',
        mapUrl: ' https://maps.app.goo.gl/abc ',
        cityUk: ' Київ ',
        cityRu: ' Киев ',
        storeName: ' Крамниця ',
        streetAddressUk: '',
        streetAddressRu: '',
        regionUk: '',
        regionRu: '',
        postalCode: '61038',
        weekdaysOpens: '9:00',
        weekdaysCloses: '16:00',
        saturdayOpens: ' ',
        saturdayCloses: '',
        sundayOpens: '',
        sundayCloses: '',
      }),
    ).toEqual({
      salesPhone: '+380681112233',
      viberPhone: '+380504445566',
      email: 'sales@example.test',
      telegramUrl: 'https://t.me/kedr',
      mapUrl: 'https://maps.app.goo.gl/abc',
      cityUk: 'Київ',
      cityRu: 'Киев',
      store: {
        storeName: 'Крамниця',
        streetAddressUk: null,
        streetAddressRu: null,
        regionUk: null,
        regionRu: null,
        postalCode: '61038',
        weekdaysOpens: '9:00',
        weekdaysCloses: '16:00',
        saturdayOpens: null,
        saturdayCloses: null,
        sundayOpens: null,
        sundayCloses: null,
      },
    });
  });
});
