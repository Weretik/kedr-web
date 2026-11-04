import { getPublicOfferDictionary } from './public-offer-dictionary';

describe('getPublicOfferDictionary', () => {
  it.each(['uk', 'ru'] as const)('keeps only page chrome for %s', (locale) => {
    const dictionary = getPublicOfferDictionary(locale);

    expect(dictionary.locale).toBe(locale);
    expect(dictionary.title).toMatch(/оферта/);
    expect(Object.keys(dictionary)).not.toContain('sections');
  });
});
