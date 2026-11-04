import { getLegalDocument } from './legal-document-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const edition = {
  kind: 'public-offer',
  number: 2,
  effectiveFrom: '2026-11-10',
  title: 'Публічна оферта',
  bodyHtml: '<h2>Загальні</h2><p>Текст</p>',
  publishedAt: '2026-11-04T12:00:00Z',
};

describe('getLegalDocument', () => {
  beforeEach(() => vi.clearAllMocks());

  it('reads the published edition of the kind and tags it', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: edition });

    expect(await getLegalDocument('uk', 'public-offer')).toEqual({
      kind: 'ok',
      document: {
        kind: 'public-offer',
        number: 2,
        effectiveFrom: '2026-11-10',
        title: 'Публічна оферта',
        bodyHtml: '<h2>Загальні</h2><p>Текст</p>',
      },
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/documents/{kind}', {
      path: { lang: 'uk', kind: 'public-offer' },
    });
    expect(cacheTag).toHaveBeenCalledWith(
      'content',
      'content:documents',
      'content:document:public-offer',
    );
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
  });

  it('answers not-found when nothing is published', async () => {
    siteApiGet.mockResolvedValue({ kind: 'not-found' });

    expect(await getLegalDocument('ru', 'returns-policy')).toEqual({ kind: 'not-found' });
  });

  it('answers unavailable and caches the failure briefly', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable' });

    expect(await getLegalDocument('uk', 'delivery-payment')).toEqual({ kind: 'unavailable' });
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
