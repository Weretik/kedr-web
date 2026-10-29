import { CATEGORY_LINKS, INFO_LINKS, REGION_SLUGS } from './site-navigation';
import { getShellDictionary } from '../i18n/shell-dictionary';

describe('site navigation', () => {
  it('keeps the current storefront category URLs', () => {
    expect(CATEGORY_LINKS.map((link) => link.path)).toContain('/catalog/zamki-900002/products');
    expect(CATEGORY_LINKS.map((link) => link.path)).toContain('/catalog/dveri-7226/products');
  });

  it('has a label for every link and region in both languages', () => {
    for (const locale of ['uk', 'ru'] as const) {
      const dictionary = getShellDictionary(locale);
      for (const link of INFO_LINKS) expect(dictionary.links[link.key]).toBeTruthy();
      for (const link of CATEGORY_LINKS) expect(dictionary.categories[link.key]).toBeTruthy();
      for (const slug of REGION_SLUGS) expect(dictionary.regionNames[slug]).toBeTruthy();
    }
  });

  it('lists all 23 regions once', () => {
    expect(new Set(REGION_SLUGS).size).toBe(23);
  });
});
