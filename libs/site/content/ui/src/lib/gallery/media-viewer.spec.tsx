import { getGalleryDictionary } from '@site/content/model';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

import { GalleryBrowser } from './gallery-browser';
import { VideoFrame } from './video-frame';

import type {
  GalleryDictionary,
  GalleryMedia,
  GalleryPhoto,
  GalleryVideo,
} from '@site/content/model';
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

/** Synthetic component fixtures never enter the production manifest. */
function photo(index: number, locale: Locale = 'uk'): GalleryPhoto {
  return {
    id: `photo-${index}`,
    kind: 'photo',
    title: `${locale === 'uk' ? 'Фото механізму' : 'Фото механизма'} ${index}`,
    caption: `${locale === 'uk' ? 'Деталі' : 'Детали'} ${index}`,
    image: {
      src: `/images/gallery/photo-${index}.jpg`,
      width: 900,
      height: 1200,
      alt: `${locale === 'uk' ? 'Механізм' : 'Механизм'} ${index}`,
    },
  };
}

function video(index: number, locale: Locale = 'uk'): GalleryVideo {
  return {
    id: `video-${index}`,
    kind: 'video',
    provider: 'youtube',
    youtubeId: index === 1 ? 'abcdefghijk' : 'lmnopqrstuv',
    title: `${locale === 'uk' ? 'Відео механізму' : 'Видео механизма'} ${index}`,
    caption: `${locale === 'uk' ? 'Огляд' : 'Обзор'} ${index}`,
    poster: {
      src: `/images/gallery/video-${index}.jpg`,
      width: 1280,
      height: 720,
      alt: `${locale === 'uk' ? 'Обкладинка' : 'Обложка'} ${index}`,
    },
  };
}

function openMedia(item: GalleryMedia, dictionary: GalleryDictionary) {
  const trigger = screen.getByRole('link', {
    name: (item.kind === 'photo' ? dictionary.openPhoto : dictionary.openVideo).replace(
      '{title}',
      item.title,
    ),
  });
  trigger.focus();
  // React handles the selection before document bubbling; avoid unsupported native JSDOM navigation.
  const stopNativeNavigation = (event: Event) => event.preventDefault();
  document.addEventListener('click', stopNativeNavigation);
  try {
    fireEvent.click(trigger);
  } finally {
    document.removeEventListener('click', stopNativeNavigation);
  }
  return trigger;
}

function position(dictionary: GalleryDictionary, current: number, total: number) {
  return dictionary.position
    .replace('{current}', String(current))
    .replace('{total}', String(total));
}

describe.each(['uk', 'ru'] as const)('gallery viewer: %s', (locale) => {
  const dictionary = getGalleryDictionary(locale);

  it('enhances a real card into a localized full-photo dialog and returns focus on close', async () => {
    const item = photo(1, locale);
    render(<GalleryBrowser items={[item]} dictionary={dictionary} />);
    expect(document.querySelector('iframe')).toBeNull();
    const trigger = openMedia(item, dictionary);
    const dialog = await screen.findByRole('dialog', { name: item.title });

    expect(within(dialog).getByRole('heading', { name: item.title })).toBeDefined();
    expect(within(dialog).getByText(item.caption!)).toBeDefined();
    expect(dialog.textContent).toContain(position(dictionary, 1, 1));
    expect(
      within(dialog)
        .getByRole('img', { name: item.image.alt })
        .classList.contains('object-contain'),
    ).toBe(true);
    expect(within(dialog).queryByRole('button', { name: dictionary.previous })).toBeNull();
    expect(within(dialog).queryByRole('button', { name: dictionary.next })).toBeNull();

    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.close }));
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });
});

describe('gallery viewer navigation and recovery', () => {
  const dictionary = getGalleryDictionary('uk');

  it('navigates the complete filtered collection beyond revealed cards without wrapping', async () => {
    const photos = Array.from({ length: 9 }, (_, index) => photo(index + 1));
    render(<GalleryBrowser items={[...photos, video(1)]} dictionary={dictionary} />);
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.photo }));
    expect(screen.getAllByRole('article')).toHaveLength(7);
    const trigger = openMedia(photos[6], dictionary);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain(position(dictionary, 7, 9));

    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.next }));
    expect(within(dialog).getByRole('heading', { name: photos[7].title })).toBeDefined();
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(dialog.textContent).toContain(position(dictionary, 9, 9));
    expect(
      (within(dialog).getByRole('button', { name: dictionary.next }) as HTMLButtonElement).disabled,
    ).toBe(true);
    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    expect(within(dialog).getByRole('heading', { name: photos[8].title })).toBeDefined();

    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('contains focus, bounds previous navigation and leaves iframe keyboard control alone', async () => {
    const items = [photo(1), video(1), photo(2)];
    render(
      <>
        <button type="button">Outside gallery</button>
        <GalleryBrowser items={items} dictionary={dictionary} />
      </>,
    );
    const outside = screen.getByRole('button', { name: 'Outside gallery' });
    const trigger = openMedia(items[0], dictionary);
    const dialog = await screen.findByRole('dialog');
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
    outside.focus();
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(
      (within(dialog).getByRole('button', { name: dictionary.previous }) as HTMLButtonElement)
        .disabled,
    ).toBe(true);
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' });
    expect(dialog.textContent).toContain(position(dictionary, 1, 3));

    fireEvent.keyDown(dialog, { key: 'ArrowRight' });
    const frame = within(dialog).getByTitle(items[1].title);
    expect(new URL(frame.getAttribute('src')!).searchParams.get('autoplay')).toBe('0');
    fireEvent.keyDown(frame, { key: 'ArrowRight' });
    expect(within(dialog).getByRole('heading', { name: items[1].title })).toBeDefined();
    fireEvent.keyDown(within(dialog).getByRole('button', { name: dictionary.next }), {
      key: 'ArrowRight',
    });
    expect(within(dialog).getByRole('heading', { name: items[2].title })).toBeDefined();
    expect(frame.isConnected).toBe(false);

    fireEvent.keyDown(dialog, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('retries a failed full photo while keeping close and navigation available', async () => {
    const items = [photo(1), photo(2)];
    render(<GalleryBrowser items={items} dictionary={dictionary} />);
    openMedia(items[0], dictionary);
    const dialog = await screen.findByRole('dialog');
    const image = within(dialog).getByRole('img', { name: items[0].image.alt });
    fireEvent.error(image);
    expect(within(dialog).getByText(dictionary.imageError)).toBeDefined();
    expect(within(dialog).getByText(items[0].caption!)).toBeDefined();
    expect(within(dialog).getByRole('button', { name: dictionary.close })).toBeDefined();
    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.retryImage }));
    expect(within(dialog).getByRole('img', { name: items[0].image.alt })).not.toBe(image);
    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.next }));
    expect(within(dialog).getByRole('heading', { name: items[1].title })).toBeDefined();
  });

  it('mounts only the selected video and preserves original/reload regardless of iframe events', async () => {
    const items = [video(1), video(2)];
    const { rerender } = render(<GalleryBrowser items={items} dictionary={dictionary} />);
    expect(document.querySelector('iframe')).toBeNull();
    const trigger = openMedia(items[0], dictionary);
    const dialog = await screen.findByRole('dialog');
    const first = within(dialog).getByTitle(items[0].title);
    const src = new URL(first.getAttribute('src')!);
    expect(src.origin).toBe('https://www.youtube.com');
    expect(src.pathname).toBe(`/embed/${items[0].youtubeId}`);
    expect(src.searchParams.get('autoplay')).toBe('0');
    expect(document.querySelectorAll('iframe')).toHaveLength(1);
    expect(document.querySelector('script[src*="youtube"]')).toBeNull();
    expect(
      within(dialog).getByRole('link', { name: dictionary.watchOriginal }).getAttribute('href'),
    ).toBe(`https://www.youtube.com/watch?v=${items[0].youtubeId}`);
    fireEvent.load(first);
    fireEvent.error(first);
    expect(within(dialog).getByText(dictionary.videoHelp)).toBeDefined();
    expect(within(dialog).getByRole('button', { name: dictionary.retryVideo })).toBeDefined();
    rerender(<GalleryBrowser items={items} dictionary={dictionary} />);
    expect(within(dialog).getByTitle(items[0].title)).toBe(first);

    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.retryVideo }));
    const reloaded = within(dialog).getByTitle(items[0].title);
    expect(reloaded).not.toBe(first);
    expect(first.isConnected).toBe(false);
    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.next }));
    expect(reloaded.isConnected).toBe(false);
    expect(document.querySelectorAll('iframe')).toHaveLength(1);
    expect(within(dialog).getByTitle(items[1].title).getAttribute('src')).toContain(
      `/embed/${items[1].youtubeId}?`,
    );
    fireEvent.click(within(dialog).getByRole('button', { name: dictionary.close }));
    await waitFor(() => expect(document.querySelector('iframe')).toBeNull());
    await waitFor(() => expect(document.activeElement).toBe(trigger));
  });

  it('closes an active player when the format, source or locale changes', async () => {
    const items = [video(1), photo(1)];
    const { rerender } = render(<GalleryBrowser items={items} dictionary={dictionary} />);
    const photoFilter = screen.getByRole('button', { name: dictionary.filters.photo });
    openMedia(items[0], dictionary);
    await screen.findByRole('dialog');
    fireEvent.click(photoFilter);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.querySelector('iframe')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: dictionary.filters.all }));
    openMedia(items[0], dictionary);
    await screen.findByRole('dialog');
    rerender(<GalleryBrowser items={[...items, photo(2)]} dictionary={dictionary} />);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.querySelector('iframe')).toBeNull();

    openMedia(items[0], dictionary);
    await screen.findByRole('dialog');
    const ru = getGalleryDictionary('ru');
    rerender(<GalleryBrowser items={[video(1, 'ru'), photo(1, 'ru')]} dictionary={ru} />);
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
    expect(document.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('button', { name: ru.filters.all }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });
});

it.each(['short', 'https://untrusted.example/video', 'abc/def?ghi'])(
  'does not embed an invalid provider ID: %s',
  (youtubeId) => {
    render(
      <VideoFrame video={{ ...video(1), youtubeId }} dictionary={getGalleryDictionary('uk')} />,
    );
    expect(document.querySelector('iframe')).toBeNull();
    expect(
      screen
        .getByRole('link', { name: getGalleryDictionary('uk').watchOriginal })
        .getAttribute('href'),
    ).toBe(`https://www.youtube.com/watch?v=${encodeURIComponent(youtubeId)}`);
    expect(
      screen.getByRole('button', { name: getGalleryDictionary('uk').retryVideo }),
    ).toBeDefined();
  },
);
