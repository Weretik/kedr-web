import { HOME_SEO_TEXT, buildHomeMetadata } from './home-metadata';

describe('buildHomeMetadata', () => {
  it('keeps titles and descriptions within search snippet limits', () => {
    for (const { title, description } of Object.values(HOME_SEO_TEXT)) {
      expect(title.length).toBeLessThanOrEqual(60);
      expect(description.length).toBeLessThanOrEqual(160);
    }
  });

  it('builds a self canonical with language alternates', () => {
    const metadata = buildHomeMetadata('ru');

    expect(metadata.title).toBe(HOME_SEO_TEXT.ru.title);
    expect(metadata.alternates?.canonical).toBe('/ru');
    expect(metadata.alternates?.languages).toMatchObject({
      'uk-UA': '/uk',
      'ru-UA': '/ru',
      'x-default': '/uk',
    });
    expect(metadata.openGraph).toMatchObject({ url: '/ru', locale: 'ru_UA' });
  });
});
