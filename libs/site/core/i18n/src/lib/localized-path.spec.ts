import { localizedPath, localizedPaths, stripLocale, switchLocalePath } from './localized-path';

describe('localized paths', () => {
  it('builds paths without a trailing slash', () => {
    expect(localizedPath('uk')).toBe('/uk');
    expect(localizedPath('ru', '/catalog/products/')).toBe('/ru/catalog/products');
    expect(localizedPath('uk', 'contacts?tab=map')).toBe('/uk/contacts');
  });

  it('strips only a supported locale prefix', () => {
    expect(stripLocale('/ru/contacts')).toBe('/contacts');
    expect(stripLocale('/uk')).toBe('/');
    expect(stripLocale('/en/contacts')).toBe('/en/contacts');
  });

  it('switches the language of the same page', () => {
    expect(switchLocalePath('/uk/catalog/product/lock-1', 'ru')).toBe('/ru/catalog/product/lock-1');
    expect(switchLocalePath('/ru', 'uk')).toBe('/uk');
  });

  it('lists the page in every locale', () => {
    expect(localizedPaths('/wholesale')).toEqual({ uk: '/uk/wholesale', ru: '/ru/wholesale' });
  });
});
