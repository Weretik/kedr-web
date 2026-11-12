import { getSiteSeoSettings, withSiteSharePicture } from './seo-settings-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const row = {
  googleAnalyticsId: 'G-AB12CD34EF',
  googleTagManagerId: null,
  googleSiteVerification: 'AbCdEf_123-xyz',
  bingSiteVerification: null,
  shareImage: { url: 'https://images-kedr.cdn.express/og/share.jpg', width: 1200, height: 630 },
};

describe('getSiteSeoSettings', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the saved settings and tags them', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: row });

    expect(await getSiteSeoSettings()).toEqual({
      googleAnalyticsId: 'G-AB12CD34EF',
      googleTagManagerId: null,
      googleSiteVerification: 'AbCdEf_123-xyz',
      bingSiteVerification: null,
      sharePicture: {
        url: 'https://images-kedr.cdn.express/og/share.jpg',
        width: 1200,
        height: 630,
      },
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/seo-settings');
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:seo-settings');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
  });

  it.each([{ kind: 'unavailable' }, { kind: 'not-found' }])(
    'adds no codes when the API answers $kind',
    async (result) => {
      siteApiGet.mockResolvedValue(result);

      const settings = await getSiteSeoSettings();

      expect(settings.googleAnalyticsId).toBeNull();
      expect(settings.sharePicture).toBeNull();
      expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
    },
  );
});

describe('withSiteSharePicture', () => {
  beforeEach(() => vi.clearAllMocks());

  const page = {
    title: 'Контакти',
    openGraph: {
      images: [{ url: '/assets/og/kedr-og.jpg', width: 1200, height: 630, alt: 'Class Kedr' }],
    },
  };

  it('replaces the default picture with the admin one', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: row });

    const metadata = await withSiteSharePicture(Promise.resolve(page));

    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://images-kedr.cdn.express/og/share.jpg',
        width: 1200,
        height: 630,
        alt: 'Class Kedr',
      },
    ]);
  });

  it('keeps a page picture of its own', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: row });
    const product = { openGraph: { images: [{ url: 'https://images-kedr.cdn.express/p/1.jpg' }] } };

    expect(await withSiteSharePicture(product)).toEqual(product);
  });
});
