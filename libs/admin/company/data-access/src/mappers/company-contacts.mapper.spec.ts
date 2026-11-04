import { mapCompanyContacts, toSaveCompanyContactsBody } from './company-contacts.mapper';

const dto = {
  salesPhone: '+380687135049',
  email: 'kedr.class19@gmail.com',
  telegramUrl: 'https://t.me/+380687135049',
  viberPhone: '+380687135049',
  mapUrl: 'https://maps.app.goo.gl/D2rH3HcaxLfxik5H6',
  cityUk: 'Харків',
  cityRu: 'Харьков',
  updatedAt: '2026-11-04T00:00:00Z',
};

describe('company contacts mapper', () => {
  it('reads the response and rejects a broken one', () => {
    expect(mapCompanyContacts(dto)).toEqual(dto);
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
      }),
    ).toEqual({
      salesPhone: '+380681112233',
      viberPhone: '+380504445566',
      email: 'sales@example.test',
      telegramUrl: 'https://t.me/kedr',
      mapUrl: 'https://maps.app.goo.gl/abc',
      cityUk: 'Київ',
      cityRu: 'Киев',
    });
  });
});
