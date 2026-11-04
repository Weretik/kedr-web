import {
  mapArticle,
  mapArticleSummaries,
  mapLegacyCoversMoved,
  toCoverUrl,
  toSaveArticleBody,
} from './article.mapper';

vi.mock('@admin/shared/config', () => ({ appConfig: { apiBaseUrl: 'https://api.example.test/' } }));

const article = {
  id: 7,
  slug: 'prykhovani-petli',
  publishedOn: '2026-11-04',
  isPublished: false,
  coverPath: '/api/content/articles/7/cover?v=2',
  updatedAt: '2026-11-04T10:00:00Z',
  texts: [
    { language: 'uk', title: 'Петлі', excerpt: 'Коротко.', bodyHtml: '<p>Текст</p>' },
    { language: 'ru', title: 'Петли', excerpt: 'Кратко.', bodyHtml: '<p>Текст</p>' },
  ],
};

describe('article mapper', () => {
  it('maps an article by language with an absolute cover URL', () => {
    const mapped = mapArticle(article);

    expect(mapped.coverUrl).toBe('https://api.example.test/api/content/articles/7/cover?v=2');
    expect(mapped.texts.ru.title).toBe('Петли');
    expect(mapped.updatedBy).toBeNull();
    expect(toCoverUrl(null)).toBeNull();
    expect(toCoverUrl('/legacy', 'https://cdn.example.test/a.webp')).toBe(
      'https://cdn.example.test/a.webp',
    );
  });

  it('marks list rows whose cover is still a legacy one and reads the move answer', () => {
    const [legacy, cdn] = mapArticleSummaries([
      { ...article, title: 'Стара' },
      {
        ...article,
        title: 'Нова',
        coverPath: null,
        coverUrl: 'https://cdn.example.test/articles/a.webp',
      },
    ]);
    expect([legacy.hasLegacyCover, cdn.hasLegacyCover]).toEqual([true, false]);
    expect(mapLegacyCoversMoved({ moved: 6 })).toBe(6);
  });

  it('rejects a response that does not match the contract', () => {
    expect(() => mapArticleSummaries([{ id: 'x' }])).toThrow();
  });

  it('sends an empty slug as null and trims texts', () => {
    const body = toSaveArticleBody({
      slug: ' ',
      publishedOn: '2026-11-04',
      isPublished: true,
      cover: { mediaFileId: 12, url: 'https://cdn.example.test/articles/a.webp' },
      texts: {
        uk: { title: ' Петлі ', excerpt: 'Коротко.', bodyHtml: '<p>Текст</p>' },
        ru: { title: 'Петли', excerpt: 'Кратко.', bodyHtml: '<p>Текст</p>' },
      },
    });

    expect(body.slug).toBeNull();
    expect(body.coverMediaFileId).toBe(12);
    expect(body.removeCover).toBe(false);
    expect(body.texts[0]).toEqual({
      language: 'uk',
      title: 'Петлі',
      excerpt: 'Коротко.',
      bodyHtml: '<p>Текст</p>',
    });
  });

  it('asks to remove a dropped cover and leaves a kept legacy one alone', () => {
    const base = {
      slug: 'a',
      publishedOn: '2026-11-04',
      isPublished: true,
      texts: {
        uk: { title: 'Т', excerpt: 'К', bodyHtml: '<p>Т</p>' },
        ru: { title: 'Т', excerpt: 'К', bodyHtml: '<p>Т</p>' },
      },
    };

    expect(toSaveArticleBody({ ...base, cover: null }).removeCover).toBe(true);
    const legacy = toSaveArticleBody({ ...base, cover: { mediaFileId: null, url: 'https://x/a' } });
    expect(legacy.removeCover).toBe(false);
    expect(legacy.coverMediaFileId).toBeUndefined();
  });
});
