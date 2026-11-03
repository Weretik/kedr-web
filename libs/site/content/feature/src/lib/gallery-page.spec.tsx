import { getGalleryMedia } from '@site/content/data-access';
import { getGalleryDictionary } from '@site/content/model';
import { siteConfig } from '@site/core/config';
import { renderToStaticMarkup } from 'react-dom/server';

import { GalleryPage } from './gallery-page';

import type { ImgHTMLAttributes } from 'react';

vi.mock('server-only', () => ({}));
vi.mock('@site/content/data-access', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@site/content/data-access')>();
  return { ...actual, getGalleryMedia: vi.fn(actual.getGalleryMedia) };
});
vi.mock('next/image', () => ({
  default: ({ src, alt, width, height, sizes }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} width={width} height={height} sizes={sizes} />
  ),
}));

beforeEach(async () => {
  const actual = await vi.importActual<typeof import('@site/content/data-access')>(
    '@site/content/data-access',
  );
  vi.mocked(getGalleryMedia).mockImplementation(actual.getGalleryMedia);
});

describe.each(['uk', 'ru'] as const)('gallery server composition: %s', (locale) => {
  it('renders the approved localized collection and native destinations in the initial HTML', () => {
    const media = getGalleryMedia(locale);
    const dictionary = getGalleryDictionary(locale);
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<GalleryPage locale={locale} />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
    expect(container.querySelector('h1')?.textContent).toBe(dictionary.title);
    expect(container.querySelectorAll('article')).toHaveLength(7);
    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
    const hrefs = [...container.querySelectorAll('a')].map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/' + locale);
    for (const item of media) {
      expect(container.textContent).toContain(item.title);
      expect(hrefs).toContain(
        item.kind === 'photo'
          ? item.image.src
          : 'https://www.youtube.com/watch?v=' + item.youtubeId,
      );
    }
    expect(vi.mocked(getGalleryMedia)).toHaveBeenCalledWith(locale);
  });

  it('renders only the page BreadcrumbList and uses the configured locale origin', () => {
    const container = document.createElement('div');
    container.innerHTML = renderToStaticMarkup(<GalleryPage locale={locale} />);
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
    expect(container.innerHTML).not.toContain('"@type":"Organization"');
    expect(container.innerHTML).not.toContain('"@type":"VideoObject"');
  });

  it('keeps unexposed materials reachable without JavaScript through the noscript remainder', () => {
    const media = getGalleryMedia(locale);
    const fixture = media[0];
    vi.mocked(getGalleryMedia).mockReturnValue([
      ...media,
      { ...fixture, id: 'extra-8', title: 'Additional fixture 8' },
      { ...fixture, id: 'extra-9', title: 'Additional fixture 9' },
    ]);
    const html = renderToStaticMarkup(<GalleryPage locale={locale} />);
    const container = document.createElement('div');
    container.innerHTML = html;
    expect(container.querySelectorAll('article')).toHaveLength(7);
    expect(container.querySelector('noscript')).not.toBeNull();
    expect(html).toContain('Additional fixture 8');
    expect(html).toContain('Additional fixture 9');
    expect(container.querySelector('iframe')).toBeNull();
  });
});
