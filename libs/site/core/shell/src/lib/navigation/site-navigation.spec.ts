import { CATEGORY_LINKS, INFO_LINKS } from './site-navigation';
import { getShellDictionary } from '../i18n/shell-dictionary';

describe('site navigation', () => {
  it('uses flat category URLs for the fallback sections', () => {
    expect(CATEGORY_LINKS.map((link) => link.path)).toContain('/catalog/zamki-900002');
    expect(CATEGORY_LINKS.map((link) => link.path)).toContain('/catalog/dveri-7226');
  });

  it('has a label for every link in both languages', () => {
    for (const locale of ['uk', 'ru'] as const) {
      const dictionary = getShellDictionary(locale);
      for (const link of INFO_LINKS) expect(dictionary.links[link.key]).toBeTruthy();
      for (const link of CATEGORY_LINKS) expect(dictionary.categories[link.key]).toBeTruthy();
    }
  });
});
