import { getGalleryDictionary } from '@site/content/model';
import { siteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { GalleryPage } from './gallery-page';

import type { GalleryMedia } from '@site/content/model';
import type { ImgHTMLAttributes } from 'react';

const { getGallery } = vi.hoisted(() => ({ getGallery: vi.fn() }));

vi.mock('server-only', () => ({}));
vi.mock('@site/content/data-access', () => ({ getGallery }));
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, sizes }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} width={width} height={height} sizes={sizes} />
  ),
}));

const video = (index: number): GalleryMedia => ({
  id: `video-${index}`,
  kind: 'video',
  provider: 'youtube',
  youtubeId: `abcdefghij${index}`,
  title: `Відео ${index}`,
  poster: {
    src: `https://i.ytimg.com/vi/abcdefghij${index}/hqdefault.jpg`,
    width: 480,
    height: 360,
    alt: `Постер ${index}`,
  },
});
const photo: GalleryMedia = {
  id: 'photo-1',
  kind: 'photo',
  title: 'Склад',
  caption: 'Київ',
  image: {
    src: 'https://images-kedr.cdn.express/gallery/1.jpg',
    width: 1200,
    height: 800,
    alt: 'Склад',
  },
};

beforeEach(() => {
  getGallery.mockResolvedValue({ kind: 'ok', items: [photo, video(1), video(2)] });
});

describe.each(['uk', 'ru'] as const)('gallery server composition: %s', (locale) => {
  it('renders the admin cards and native destinations in the initial HTML', async () => {
    const dictionary = getGalleryDictionary(locale);
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await GalleryPage({ locale }));
    expect(getGallery).toHaveBeenCalledWith(locale);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(dictionary.title);
    expect(container.querySelectorAll('article')).toHaveLength(3);
    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/' + locale);
    expect(hrefs).toContain(photo.kind === 'photo' ? photo.image.src : '');
    expect(hrefs).toContain('https://www.youtube.com/watch?v=abcdefghij1');
    expect(container.textContent).toContain('Київ');
  });

  it('renders only the page BreadcrumbList and uses the configured locale origin', async () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(await GalleryPage({ locale }));
    const scripts = container.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts).toHaveLength(1);
    const graph = JSON.parse(scripts[0].textContent ?? '{}');
    expect(graph['@type']).toBe('BreadcrumbList');
    expect(graph.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'uk' ? 'Головна' : 'Главная',
        item: siteConfig.siteUrl + '/' + locale,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: getGalleryDictionary(locale).title,
        item: siteConfig.siteUrl + '/' + locale + '/galleria',
      },
    ]);
    expect(container.innerHTML).not.toContain('"@type":"VideoObject"');
  });

  it('keeps unexposed materials reachable without JavaScript through the noscript remainder', async () => {
    getGallery.mockResolvedValue({
      kind: 'ok',
      items: Array.from({ length: 9 }, (_, index) => video(index)),
    });
    const html = renderToStaticMarkup(await GalleryPage({ locale }));
    const container = document.createElement('div');
    container.innerHTML = html;
    expect(container.querySelectorAll('article')).toHaveLength(7);
    expect(container.querySelector('noscript')).not.toBeNull();
    expect(html).toContain('Відео 7');
    expect(html).toContain('Відео 8');
  });

  it('fails loudly when the API is unavailable instead of showing an empty gallery', async () => {
    getGallery.mockResolvedValue({ kind: 'unavailable' });
    await expect(GalleryPage({ locale })).rejects.toThrow('Content API is unavailable');
  });
});
