import { getGalleryDictionary } from '@site/content/model';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { GalleryBrowser } from './gallery-browser';
import { GalleryCard } from './gallery-card';
import { GalleryHeader } from './gallery-header';
import { MediaImage } from './media/media-image';

import type { GalleryMedia } from '@site/content/model';
import type { Locale } from '@site/core/i18n';
import type { ImgHTMLAttributes } from 'react';

vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    sizes,
    loading,
    onLoad,
    onError,
    className,
  }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      loading={loading}
      onLoad={onLoad}
      onError={onError}
      className={className}
    />
  ),
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/** Synthetic mixed content proves UI states; it is never imported into the production source. */
function exampleMedia(locale: Locale = 'uk', total = 17): readonly GalleryMedia[] {
  return Array.from({ length: total }, (_, index): GalleryMedia => {
    const image = {
      src: `/images/gallery/test-${index + 1}.jpg`,
      width: 1280,
      height: 720,
      alt: `${locale === 'uk' ? 'Тестове фото' : 'Тестовое фото'} ${index + 1}`,
    };
    const common = {
      id: `test-${index + 1}`,
      title: `${locale === 'uk' ? 'Тестовий матеріал' : 'Тестовый материал'} ${index + 1}`,
      caption: `${locale === 'uk' ? 'Підпис' : 'Подпись'} ${index + 1}`,
    };
    return index % 2 === 0
      ? { ...common, kind: 'photo', image }
      : {
          ...common,
          kind: 'video',
          provider: 'youtube',
          youtubeId: '1eB0xxFgwlw',
          poster: image,
        };
  });
}

describe.each(['uk', 'ru'] as const)('gallery composition: %s', (locale) => {
  const dictionary = getGalleryDictionary(locale);

  it('renders one localized header, a home breadcrumb and the first seven materials without duplicates', () => {
    const items = exampleMedia(locale);
    const { container } = render(
      <>
        <GalleryHeader locale={locale} />
        <GalleryBrowser items={items} dictionary={dictionary} />
      </>,
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(dictionary.title);
    expect(screen.getByRole('navigation', { name: dictionary.breadcrumbs })).toBeDefined();
    expect(screen.getByRole('link', { name: dictionary.home }).getAttribute('href')).toBe(
      `/${locale}`,
    );
    expect(screen.getByText(dictionary.intro)).toBeDefined();
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual(
      items.slice(0, 7).map(({ title }) => title),
    );
    expect(
      screen.getByRole('button', { name: dictionary.filters.all }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect(container.querySelectorAll('main, iframe')).toHaveLength(0);
  });

  it('reveals four more at a time, preserves order and removes the exhausted action', () => {
    const items = exampleMedia(locale);
    render(<GalleryBrowser items={items} dictionary={dictionary} />);
    const more = screen.getByRole('button', { name: dictionary.showMore });
    more.focus();
    fireEvent.click(more);
    expect(screen.getAllByRole('article')).toHaveLength(11);
    expect(document.activeElement).toBe(more);
    expect(screen.getByText(dictionary.itemsAdded.replace('{count}', '4'))).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: dictionary.showMore }));
    expect(screen.getAllByRole('article')).toHaveLength(15);
    fireEvent.click(screen.getByRole('button', { name: dictionary.showMore }));
    expect(screen.getAllByRole('article')).toHaveLength(17);
    expect(screen.queryByRole('button', { name: dictionary.showMore })).toBeNull();
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual(
      items.map(({ title }) => title),
    );
    expect(screen.getByText(dictionary.itemsAdded.replace('{count}', '2'))).toBeDefined();
  });

  it('filters the whole collection, resets the revealed portion and leaves URL/history alone', () => {
    const pushState = vi.spyOn(window.history, 'pushState');
    const replaceState = vi.spyOn(window.history, 'replaceState');
    const before = window.location.href;
    const items = exampleMedia(locale);
    render(<GalleryBrowser items={items} dictionary={dictionary} />);
    fireEvent.click(screen.getByRole('button', { name: dictionary.showMore }));
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.photo }));
    const photos = items.filter(({ kind }) => kind === 'photo');
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(screen.getAllByRole('heading', { level: 2 }).map((node) => node.textContent)).toEqual(
      photos.slice(0, 7).map(({ title }) => title),
    );
    expect(
      screen.getByRole('button', { name: dictionary.filters.photo }).getAttribute('aria-pressed'),
    ).toBe('true');
    fireEvent.click(screen.getByRole('button', { name: dictionary.showMore }));
    expect(screen.getAllByRole('article')).toHaveLength(9);
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.video }));
    expect(screen.getAllByRole('article')).toHaveLength(7);
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.all }));
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(pushState).not.toHaveBeenCalled();
    expect(replaceState).not.toHaveBeenCalled();
    expect(window.location.href).toBe(before);
  });

  it('offers a real reset for a missing format without inventing photo cards', () => {
    const videos = exampleMedia(locale).filter(({ kind }) => kind === 'video');
    render(<GalleryBrowser items={videos} dictionary={dictionary} />);
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.photo }));
    expect(screen.queryByRole('article')).toBeNull();
    expect(screen.getByText(dictionary.emptyFilterTitle)).toBeDefined();
    expect(screen.queryByRole('button', { name: dictionary.showMore })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: dictionary.showAll }));
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(
      screen.getByRole('button', { name: dictionary.filters.all }).getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('keeps titles, native image/YouTube destinations and no player in the initial server HTML', () => {
    const items = exampleMedia(locale);
    const root = document.createElement('div');
    root.innerHTML = renderToStaticMarkup(<GalleryBrowser items={items} dictionary={dictionary} />);
    const links = Array.from(root.querySelectorAll('article a[href]'));
    expect(links).toHaveLength(7);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      items
        .slice(0, 7)
        .map((item) =>
          item.kind === 'photo'
            ? item.image.src
            : `https://www.youtube.com/watch?v=${item.youtubeId}`,
        ),
    );
    expect(root.textContent).toContain(items[6].title);
    expect(root.textContent).not.toContain(items[7].title);
    expect(root.querySelectorAll('iframe, main')).toHaveLength(0);
  });
});

describe('gallery state and media fallbacks', () => {
  const dictionary = getGalleryDictionary('uk');

  it.each([0, 1, 2, 3])(
    'adapts to %s materials without filling slots or showing an unnecessary more action',
    (total) => {
      render(<GalleryBrowser items={exampleMedia('uk', total)} dictionary={dictionary} />);
      expect(screen.queryAllByRole('article')).toHaveLength(total);
      expect(screen.queryByRole('button', { name: dictionary.showMore })).toBeNull();
      if (total === 0) expect(screen.getByText(dictionary.emptyTitle)).toBeDefined();
    },
  );

  it('resets local browsing state when the locale changes', () => {
    const { rerender } = render(<GalleryBrowser items={exampleMedia()} dictionary={dictionary} />);
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.video }));
    fireEvent.click(screen.getByRole('button', { name: dictionary.showMore }));
    expect(screen.getAllByRole('article')).toHaveLength(8);
    const ru = getGalleryDictionary('ru');
    rerender(<GalleryBrowser items={exampleMedia('ru')} dictionary={ru} />);
    expect(screen.getAllByRole('article')).toHaveLength(7);
    expect(screen.getByRole('button', { name: ru.filters.all }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(screen.getByRole('heading', { name: 'Тестовый материал 1' })).toBeDefined();
  });

  it('passes actual dimensions/sizes, clears loading and remounts a failed image on retry', () => {
    const item = exampleMedia()[0];
    if (item.kind !== 'photo') throw new Error('The first test fixture must be a photo');
    render(<MediaImage image={item.image} dictionary={dictionary} sizes="50vw" />);
    const image = screen.getByRole('img', { name: item.image.alt });
    expect(image.getAttribute('width')).toBe('1280');
    expect(image.getAttribute('height')).toBe('720');
    expect(image.getAttribute('sizes')).toBe('50vw');
    expect(screen.getByText(dictionary.imageLoading)).toBeDefined();
    fireEvent.load(image);
    expect(screen.queryByText(dictionary.imageLoading)).toBeNull();
    fireEvent.error(image);
    expect(screen.getByText(dictionary.imageError)).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: dictionary.retryImage }));
    expect(screen.getByRole('img', { name: item.image.alt })).not.toBe(image);
    expect(screen.queryByText(dictionary.imageError)).toBeNull();
  });

  it('keeps a failed video poster selectable and its retry outside the native link', () => {
    const video = exampleMedia()[1];
    if (video.kind !== 'video') throw new Error('The second test fixture must be a video');
    const onSelect = vi.fn();
    render(<GalleryCard media={video} dictionary={dictionary} onSelect={onSelect} />);
    fireEvent.error(screen.getByRole('img', { name: video.poster.alt }));
    const article = screen.getByRole('article');
    const link = within(article).getByRole('link', {
      name: dictionary.openVideo.replace('{title}', video.title),
    });
    expect(link.getAttribute('href')).toBe(`https://www.youtube.com/watch?v=${video.youtubeId}`);
    expect(link.querySelector('button')).toBeNull();
    fireEvent.click(within(article).getByRole('button', { name: dictionary.retryImage }));
    expect(onSelect).not.toHaveBeenCalled();
    fireEvent.click(link);
    expect(onSelect).toHaveBeenCalledWith(video.id, link);
    expect(within(article).getByText(video.title)).toBeDefined();
  });

  it('enhances only plain primary activation and preserves modifier/native link behavior', () => {
    const photo = exampleMedia()[0];
    const onSelect = vi.fn();
    render(<GalleryCard media={photo} dictionary={dictionary} onSelect={onSelect} />);
    const link = screen.getByRole('link');
    const prevented: boolean[] = [];
    const stopJsdomNavigation = (event: Event) => {
      prevented.push(event.defaultPrevented);
      event.preventDefault();
    };
    document.addEventListener('click', stopJsdomNavigation);
    try {
      fireEvent.click(link);
      fireEvent.click(link, { ctrlKey: true });
      fireEvent.click(link, { metaKey: true });
      fireEvent.click(link, { shiftKey: true });
      fireEvent.click(link, { altKey: true });
      fireEvent.click(link, { button: 1 });
    } finally {
      document.removeEventListener('click', stopJsdomNavigation);
    }
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(photo.id, link);
    expect(prevented).toEqual([true, false, false, false, false, false]);
  });
});
