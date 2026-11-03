import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';

import { ArticleContent } from './article-content';
import { ArticlesContent } from './articles-content';
import { ArticlesHeader } from './articles-header';
import { ArticlesLoading } from './articles-loading';

import type { Article, ArticlesListing, ArticlesQuery } from '@site/content/model';
import type { ImgHTMLAttributes } from 'react';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('next/image', () => ({
  default: ({ src, alt, className, sizes, loading }: ImgHTMLAttributes<HTMLImageElement>) => (
    <img src={src} alt={alt} className={className} sizes={sizes} loading={loading} />
  ),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/** Synthetic article counts are isolated to this test fixture, never used by production. */
function exampleListing(total = 6, choices: Partial<ArticlesQuery> = {}): ArticlesListing {
  const query: ArticlesQuery = { q: '', page: 1, pageSize: 10, ...choices };
  const all: Article[] = Array.from({ length: total }, (_, index) => ({
    id: index + 1,
    slug: `example-${index + 1}`,
    title: `Тестова стаття ${index + 1}`,
    excerpt: `Короткий опис матеріалу ${index + 1}.`,
    paragraphs: [`Повний текст матеріалу ${index + 1}.`, 'Останній абзац джерела.'],
    image: `/images/articles/Article_${index + 1}.jpg`,
    publishedAt: '2026-03-24',
  }));
  const startIndex = (query.page - 1) * query.pageSize;
  const items = all.slice(startIndex, startIndex + query.pageSize);
  return {
    items,
    query,
    total,
    pageCount: Math.ceil(total / query.pageSize),
    start: total ? startIndex + 1 : 0,
    end: total ? startIndex + items.length : 0,
  };
}

const locales = [
  {
    locale: 'uk',
    title: 'Статті',
    searchRegion: 'Пошук матеріалів',
    searchLabel: 'Пошук у статтях',
    placeholder: 'Назва або текст статті',
    submit: 'Знайти статтю',
    pageSize: 'Статей на сторінці',
    pagination: 'Сторінки статей',
    previous: 'Попередня',
    next: 'Наступна',
    range: 'Показано 1–6 із 6',
    found: 'Знайдено 6 статей',
  },
  {
    locale: 'ru',
    title: 'Статьи',
    searchRegion: 'Поиск материалов',
    searchLabel: 'Поиск в статьях',
    placeholder: 'Название или текст статьи',
    submit: 'Найти статью',
    pageSize: 'Статей на странице',
    pagination: 'Страницы статей',
    previous: 'Предыдущая',
    next: 'Следующая',
    range: 'Показано 1–6 из 6',
    found: 'Найдено 6 статей',
  },
] as const;

describe.each(locales)('articles controls: $locale', (copy) => {
  it('provides an accessible search without a visible external label', () => {
    const { container } = render(
      <ArticlesContent locale={copy.locale} listing={exampleListing()} />,
    );
    const form = screen.getByRole('search', { name: copy.searchRegion });
    const input = within(form).getByRole('searchbox', { name: copy.searchLabel });
    expect(input.getAttribute('placeholder')).toBe(copy.placeholder);
    expect(form.getAttribute('method')).toBe('get');
    expect(form.getAttribute('action')).toBe(`/${copy.locale}/articles`);
    expect(form.querySelector('input[name="page"]')).toBeNull();
    expect(form.querySelector('input[name="pageSize"]')).toBeNull();
    expect(container.querySelector(`label[for="${input.id}"]`)?.classList.contains('sr-only')).toBe(
      true,
    );
    expect(within(form).getByRole('button', { name: copy.submit }).getAttribute('type')).toBe(
      'submit',
    );
  });

  it('renders the localized header, six source cards, range and a single-page pager', () => {
    const { container } = render(
      <>
        <ArticlesHeader locale={copy.locale} />
        <ArticlesContent locale={copy.locale} listing={exampleListing()} />
      </>,
    );
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(copy.title);
    expect(screen.getAllByRole('article')).toHaveLength(6);
    expect(screen.getByText(copy.range)).toBeDefined();
    expect(screen.getByText(copy.found)).toBeDefined();
    const size = screen.getByRole('combobox', { name: copy.pageSize }) as HTMLSelectElement;
    expect(size.value).toBe('10');
    expect(
      within(size)
        .getAllByRole('option')
        .map((option) => option.textContent),
    ).toEqual(['10', '20', '50']);
    const pager = screen.getByRole('navigation', { name: copy.pagination });
    expect(
      (within(pager).getByRole('button', { name: copy.previous }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(
      (within(pager).getByRole('button', { name: copy.next }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(pager.querySelector('[aria-current="page"]')?.textContent).toBe('1');
    expect(container.querySelector('main')).toBeNull();
    const images = [...container.querySelectorAll('img')];
    expect(images).toHaveLength(6);
    expect(images[0]?.getAttribute('loading')).toBe('eager');
    expect(images.slice(1).every((image) => image.getAttribute('loading') === 'lazy')).toBe(true);
  });

  it('changes the page size, keeps the search and starts from page one', () => {
    render(
      <ArticlesContent
        locale={copy.locale}
        listing={exampleListing(51, { q: 'петлі', page: 2 })}
      />,
    );
    fireEvent.change(screen.getByRole('combobox', { name: copy.pageSize }), {
      target: { value: '20' },
    });
    expect(push).toHaveBeenCalledOnce();
    const [href, options] = push.mock.calls[0];
    const target = new URL(href, 'https://example.test');
    expect(target.pathname).toBe(`/${copy.locale}/articles`);
    expect(Object.fromEntries(target.searchParams)).toEqual({ q: 'петлі', pageSize: '20' });
    expect(options).toEqual({ scroll: false });
  });
});

it('preserves query and size in native search and numbered navigation', () => {
  render(
    <ArticlesContent
      locale="uk"
      listing={exampleListing(51, { q: 'петлі', page: 2, pageSize: 20 })}
    />,
  );
  const search = screen.getByRole('search', { name: 'Пошук матеріалів' });
  expect((within(search).getByRole('searchbox') as HTMLInputElement).value).toBe('петлі');
  expect(search.querySelector('input[name="pageSize"]')?.getAttribute('value')).toBe('20');
  expect(screen.getByText('Показано 21–40 із 51')).toBeDefined();
  const pager = screen.getByRole('navigation', { name: 'Сторінки статей' });
  const next = within(pager).getByRole('link', { name: 'Наступна' });
  expect(new URL(next.getAttribute('href')!, 'https://example.test').hash).toBe(
    '#articles-results',
  );
  expect(document.getElementById('articles-results')).not.toBeNull();
  expect(
    Object.fromEntries(new URL(next.getAttribute('href')!, 'https://example.test').searchParams),
  ).toEqual({
    q: 'петлі',
    pageSize: '20',
    page: '3',
  });
  const previous = within(pager).getByRole('link', { name: 'Попередня' });
  expect(
    new URL(previous.getAttribute('href')!, 'https://example.test').searchParams.has('page'),
  ).toBe(false);
  expect(within(pager).getByRole('link', { name: 'Сторінка 2' }).getAttribute('aria-current')).toBe(
    'page',
  );
  expect(within(pager).getByText('2 / 3')).toBeDefined();
});

it('keeps the last arrow disabled at the end of a partial final page', () => {
  render(<ArticlesContent locale="uk" listing={exampleListing(26, { page: 3 })} />);
  expect(screen.getByText('Показано 21–26 із 26')).toBeDefined();
  const pager = screen.getByRole('navigation', { name: 'Сторінки статей' });
  expect(within(pager).getByRole('link', { name: 'Попередня' })).toBeDefined();
  expect(
    (within(pager).getByRole('button', { name: 'Наступна' }) as HTMLButtonElement).disabled,
  ).toBe(true);
});

it('distinguishes an unmatched search from an empty source and resets while keeping size', () => {
  const { rerender } = render(
    <ArticlesContent locale="uk" listing={exampleListing(0, { q: 'немає', pageSize: 20 })} />,
  );
  expect(screen.getByText('Знайдено 0 статей')).toBeDefined();
  expect(
    screen.getByRole('heading', { name: 'За вашим запитом статей не знайдено' }),
  ).toBeDefined();
  const clear = screen.getByRole('link', { name: 'Очистити пошук' });
  expect(clear.getAttribute('href')).toBe('/uk/articles?pageSize=20');
  expect(screen.queryByRole('navigation', { name: 'Сторінки статей' })).toBeNull();
  expect(screen.queryByText(/1–0/)).toBeNull();
  rerender(<ArticlesContent locale="uk" listing={exampleListing(0)} />);
  expect(screen.getByRole('heading', { name: 'Статті незабаром з’являться' })).toBeDefined();
  expect(screen.queryByRole('link', { name: 'Очистити пошук' })).toBeNull();
});

it('uses a neutral labelled fallback when an article has no cover', () => {
  const listing = exampleListing(1);
  listing.items[0].image = null;
  const { container } = render(<ArticlesContent locale="uk" listing={listing} />);
  expect(screen.getByRole('img', { name: 'Обкладинка відсутня' })).toBeDefined();
  expect(container.querySelector('img')).toBeNull();
  expect(screen.getByRole('link', { name: 'Тестова стаття 1' }).getAttribute('href')).toBe(
    '/uk/articles/example-1',
  );
});

it('announces loading and an in-flight page-size transition', async () => {
  const { unmount } = render(<ArticlesLoading locale="ru" />);
  expect(screen.getByRole('status').textContent).toContain('Загружаем статьи…');
  unmount();
  let finish!: () => void;
  push.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      }),
  );
  render(<ArticlesContent locale="uk" listing={exampleListing()} />);
  const select = screen.getByRole('combobox', { name: 'Статей на сторінці' }) as HTMLSelectElement;
  fireEvent.change(select, { target: { value: '50' } });
  expect(select.getAttribute('aria-busy')).toBe('true');
  expect(select.disabled).toBe(true);
  expect(screen.getByRole('status').textContent).toContain('Оновлюємо список…');
  await act(async () => finish());
  expect(select.getAttribute('aria-busy')).toBe('false');
  expect(select.disabled).toBe(false);
});

it.each(['uk', 'ru'] as const)(
  'renders complete source text, publication date and article links in %s',
  (locale) => {
    const article = exampleListing(1).items[0];
    const { container } = render(<ArticleContent locale={locale} article={article} />);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(article.title);
    for (const paragraph of article.paragraphs) expect(screen.getByText(paragraph)).toBeDefined();
    expect(container.querySelector('time')?.getAttribute('dateTime')).toBe('2026-03-24');
    const back = screen.getByRole('link', {
      name: locale === 'uk' ? 'До всіх статей' : 'Ко всем статьям',
    });
    expect(back.getAttribute('href')).toBe(`/${locale}/articles`);
    expect(container.querySelector('main')).toBeNull();
    expect(container.querySelector('aside')).toBeNull();
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('eager');
  },
);
