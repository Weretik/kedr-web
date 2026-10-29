import { DEFAULT_LOCALE, isLocale } from './locales';

describe('locales', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('uk')).toBe(true);
    expect(isLocale('ru')).toBe(true);
    expect(isLocale('en')).toBe(false);
  });

  it('defaults to Ukrainian', () => {
    expect(DEFAULT_LOCALE).toBe('uk');
  });
});
