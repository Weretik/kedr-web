import { getHomeBlocks } from './home-blocks-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

describe('getHomeBlocks', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps both lists in site order and tags them', async () => {
    siteApiGet.mockResolvedValue({
      kind: 'ok',
      data: {
        faq: [{ question: 'Як?', answer: 'Так.' }],
        brands: [
          { name: 'Korfad', logoUrl: 'https://cdn.test/korfad.webp', width: 320, height: 128 },
          { name: 'SOVA', logoUrl: 'https://cdn.test/sova.webp', width: null, height: null },
        ],
      },
    });

    expect(await getHomeBlocks('uk')).toEqual({
      kind: 'ok',
      faq: [{ question: 'Як?', answer: 'Так.' }],
      brands: [
        { name: 'Korfad', src: 'https://cdn.test/korfad.webp', width: 320, height: 128 },
        { name: 'SOVA', src: 'https://cdn.test/sova.webp', width: undefined, height: undefined },
      ],
    });
    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/home', { path: { lang: 'uk' } });
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:home');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
  });

  it('reports a failed read so the page can use its own texts', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable' });

    expect(await getHomeBlocks('ru')).toEqual({ kind: 'unavailable' });
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
