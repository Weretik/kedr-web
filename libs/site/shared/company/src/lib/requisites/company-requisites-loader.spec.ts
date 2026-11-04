import { getCompanyRequisites } from './company-requisites-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const row = {
  legalName: 'ФОП Тестовий Тест Тестович',
  code: '1234567890',
  registrationExtractNumber: '111',
  iban: 'UA213223130000026007233566001',
  bankName: 'Тест Банк',
  bankCode: '322313',
  updatedAt: '2026-11-04T00:00:00Z',
};

describe('getCompanyRequisites', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the saved row without updatedAt and tags it', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: row });

    expect(await getCompanyRequisites()).toEqual({
      legalName: row.legalName,
      code: row.code,
      registrationExtractNumber: row.registrationExtractNumber,
      iban: row.iban,
      bankName: row.bankName,
      bankCode: row.bankCode,
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/requisites');
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:requisites');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
  });

  it.each([{ kind: 'unavailable' }, { kind: 'not-found' }])(
    'falls back to the code values when the API answers $kind',
    async (result) => {
      siteApiGet.mockResolvedValue(result);

      const requisites = await getCompanyRequisites();

      expect(requisites.iban).toBe('UA303052990000026007025905216');
      expect(requisites.bankCode).toBe('305299');
      expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
    },
  );
});
