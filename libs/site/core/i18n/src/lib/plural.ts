import type { Locale } from './locales';

/** Word forms for Ukrainian and Russian counts: one (1, 21), few (2–4, 22–24), many (5–20, 25–30, 0). */
export type PluralForms = { one: string; few: string; many: string };

const RULES: Record<Locale, Intl.PluralRules> = {
  uk: new Intl.PluralRules('uk'),
  ru: new Intl.PluralRules('ru'),
};

/** `312 товарів`: the count with the word form its grammar needs. */
export function pluralize(locale: Locale, count: number, forms: PluralForms): string {
  const rule = RULES[locale].select(count);
  const word = rule === 'one' ? forms.one : rule === 'few' ? forms.few : forms.many;
  return `${count.toLocaleString(locale === 'uk' ? 'uk-UA' : 'ru-UA')} ${word}`;
}
