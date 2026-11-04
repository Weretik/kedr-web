import { mapArticle, mapArticleSummaries, toCoverUrl, toSaveArticleBody } from './article.mapper';

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
    expect(toCoverUrl(null)).toBeNull();
  });

  it('rejects a response that does not match the contract', () => {
    expect(() => mapArticleSummaries([{ id: 'x' }])).toThrow();
  });

  it('sends an empty slug as null and trims texts', () => {
    const body = toSaveArticleBody({
      slug: ' ',
      publishedOn: '2026-11-04',
      isPublished: true,
      texts: {
        uk: { title: ' Петлі ', excerpt: 'Коротко.', bodyHtml: '<p>Текст</p>' },
        ru: { title: 'Петли', excerpt: 'Кратко.', bodyHtml: '<p>Текст</p>' },
      },
    });

    expect(body.slug).toBeNull();
    expect(body.texts[0]).toEqual({
      language: 'uk',
      title: 'Петлі',
      excerpt: 'Коротко.',
      bodyHtml: '<p>Текст</p>',
    });
  });
});
