import { getGallery } from './gallery-loader';

const { siteApiGet, cacheLife, cacheTag } = vi.hoisted(() => ({
  siteApiGet: vi.fn(),
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ cacheLife, cacheTag }));
vi.mock('@site/shared/api-client', () => ({ siteApiGet }));

const items = [
  {
    id: 1,
    kind: 'video',
    title: 'Петля скрытая ZCG 40',
    caption: null,
    imageUrl: 'https://i.ytimg.com/vi/0FDRbSaQ9Ec/hqdefault.jpg',
    width: 480,
    height: 360,
    youtubeId: '0FDRbSaQ9Ec',
  },
  {
    id: 2,
    kind: 'photo',
    title: null,
    caption: 'Склад в Киеве',
    imageUrl: 'https://images-kedr.cdn.express/gallery/2.jpg',
    width: null,
    height: null,
    youtubeId: null,
  },
];

describe('getGallery', () => {
  beforeEach(() => vi.clearAllMocks());

  it('maps the cards in site order, filling missing titles and sizes', async () => {
    siteApiGet.mockResolvedValue({ kind: 'ok', data: items });

    const result = await getGallery('ru');

    expect(siteApiGet).toHaveBeenCalledWith('/api/content/{lang}/gallery', {
      path: { lang: 'ru' },
    });
    expect(cacheTag).toHaveBeenCalledWith('content', 'content:gallery');
    expect(cacheLife).toHaveBeenCalledWith({ stale: 300, revalidate: 600, expire: 86_400 });
    expect(result).toEqual({
      kind: 'ok',
      items: [
        {
          id: 'video-1',
          kind: 'video',
          provider: 'youtube',
          youtubeId: '0FDRbSaQ9Ec',
          title: 'Петля скрытая ZCG 40',
          poster: {
            src: 'https://i.ytimg.com/vi/0FDRbSaQ9Ec/hqdefault.jpg',
            width: 480,
            height: 360,
            alt: 'Постер видео «Петля скрытая ZCG 40»',
          },
        },
        {
          id: 'photo-2',
          kind: 'photo',
          title: 'Фото из галереи',
          caption: 'Склад в Киеве',
          image: {
            src: 'https://images-kedr.cdn.express/gallery/2.jpg',
            width: 1600,
            height: 1200,
            alt: 'Фото из галереи',
          },
        },
      ],
    });
  });

  it('reports a failed read and caches it briefly', async () => {
    siteApiGet.mockResolvedValue({ kind: 'unavailable', status: 503 });

    expect(await getGallery('uk')).toEqual({ kind: 'unavailable' });
    expect(cacheLife).toHaveBeenCalledWith({ stale: 60, revalidate: 60, expire: 3600 });
  });
});
