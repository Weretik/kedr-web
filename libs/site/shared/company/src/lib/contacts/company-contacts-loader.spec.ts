import { getCompanyContacts } from './company-contacts-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const row = {
  salesPhone: '+380671112233',
  email: 'sales@example.test',
  telegramUrl: 'https://t.me/kedr_sales',
  viberPhone: '+380504445566',
  mapUrl: 'https://maps.app.goo.gl/abc',
  cityUk: 'Київ',
  cityRu: 'Киев',
  store: {
    storeName: 'Крамниця',
    streetAddressUk: 'вул. Ахієзерів, 46',
    streetAddressRu: null,
    regionUk: 'Харківська обл.',
    regionRu: 'Харьковская обл.',
    postalCode: '61038',
    weekdaysOpens: '09:00',
    weekdaysCloses: '16:00',
    saturdayOpens: '10:00',
    saturdayCloses: '14:00',
    sundayOpens: null,
    sundayCloses: null,
  },
  updatedAt: '2026-11-04T00:00:00Z',
};

describe('getCompanyContacts', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the saved row and tags it', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: row });

    expect(await getCompanyContacts()).toEqual({
      phone: { display: '(067) 111-22-33', e164: '+380671112233' },
      email: 'sales@example.test',
      city: { uk: 'Київ', ru: 'Киев' },
      links: {
        telegram: 'https://t.me/kedr_sales',
        viber: 'viber://chat?number=%2B380504445566',
        map: 'https://maps.app.goo.gl/abc',
      },
      store: {
        name: 'Крамниця',
        streetAddress: { uk: 'вул. Ахієзерів, 46', ru: 'вул. Ахієзерів, 46' },
        region: { uk: 'Харківська обл.', ru: 'Харьковская обл.' },
        postalCode: '61038',
        hours: [
          {
            days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '16:00',
          },
          { days: ['Saturday'], opens: '10:00', closes: '14:00' },
        ],
      },
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/contacts');
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:contacts');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
  });

  it('leaves the shop out while its street is empty', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: { ...row, store: { ...row.store, streetAddressUk: ' ' } },
    });

    expect((await getCompanyContacts()).store).toBeNull();
  });

  it.each([{ kind: 'unavailable' }, { kind: 'not-found' }])(
    'falls back to the code values when the API answers $kind',
    async (result) => {
      siteApiGet.mockResolvedValue(result);

      const contacts = await getCompanyContacts();

      expect(contacts.phone.e164).toBe('+380687135049');
      expect(contacts.email).toBe('kedr.class19@gmail.com');
      expect(contacts.store?.postalCode).toBe('61038');
      expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
    },
  );
});
