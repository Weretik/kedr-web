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
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/contacts');
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:contacts');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
  });

  it.each([{ kind: 'unavailable' }, { kind: 'not-found' }])(
    'falls back to the code values when the API answers $kind',
    async (result) => {
      siteApiGet.mockResolvedValue(result);

      const contacts = await getCompanyContacts();

      expect(contacts.phone.e164).toBe('+380687135049');
      expect(contacts.email).toBe('kedr.class19@gmail.com');
      expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
    },
  );
});
