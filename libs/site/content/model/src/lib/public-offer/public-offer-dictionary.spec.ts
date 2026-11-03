import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { getPublicOfferDictionary } from './public-offer-dictionary';

import type { Locale } from '@site/core/i18n';

interface SourceDocument {
  readonly fullTitle: string;
  readonly sections: readonly {
    readonly heading: string;
    readonly paragraphs: readonly { readonly text: string }[];
  }[];
  readonly finalNote: { readonly text: string };
}

const baselinePath = 'docs/specs/site/content/001-public-offer/design/source-baseline.json';
const workspaceBaselinePath = resolve(process.cwd(), baselinePath);
const baseline = JSON.parse(
  readFileSync(
    existsSync(workspaceBaselinePath)
      ? workspaceBaselinePath
      : resolve(process.cwd(), '../../../..', baselinePath),
    'utf8',
  ),
) as { readonly locales: Readonly<Record<Locale, SourceDocument>> };

const LOCALES = ['uk', 'ru'] as const;
const SECTION_IDS = [
  'offer-general',
  'offer-site-use',
  'offer-payment',
  'offer-delivery',
  'offer-returns',
  'offer-personal-data',
  'offer-final',
];

function normalizedHeading(value: string): string {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
}

describe('public offer dictionary', () => {
  it.each(LOCALES)('preserves all seven source sections and 18 paragraphs in %s', (locale) => {
    const dictionary = getPublicOfferDictionary(locale);
    const source = baseline.locales[locale];

    expect(dictionary.locale).toBe(locale);
    expect(dictionary.sections).toHaveLength(7);
    expect(dictionary.sections.map((section) => section.paragraphs.length)).toEqual([
      4, 3, 3, 2, 4, 1, 1,
    ]);
    expect(
      dictionary.sections.map((section) => ({
        heading: normalizedHeading([section.title, section.subtitle].filter(Boolean).join(' ')),
        paragraphs: section.paragraphs,
      })),
    ).toEqual(
      source.sections.map((section) => ({
        heading: normalizedHeading(section.heading),
        paragraphs: section.paragraphs.map((paragraph) => paragraph.text),
      })),
    );
  });

  it.each(LOCALES)(
    'preserves the original full title and final unnumbered note in %s',
    (locale) => {
      const dictionary = getPublicOfferDictionary(locale);
      const source = baseline.locales[locale];

      expect(dictionary.fullTitle).toBe(source.fullTitle);
      expect(dictionary.note).toBe(source.finalNote.text);
    },
  );

  it('provides the same seven unique navigation destinations in both languages', () => {
    for (const locale of LOCALES) {
      const sections = getPublicOfferDictionary(locale).sections;

      expect(sections.map((section) => section.id)).toEqual(SECTION_IDS);
      expect(new Set(sections.map((section) => section.id)).size).toBe(7);
      expect(sections.every((section) => section.tocLabel.trim().length > 0)).toBe(true);
    }
  });

  it.each([
    ['uk', 'Публічна оферта', 'Друкувати'],
    ['ru', 'Публичная оферта', 'Печатать'],
  ] as const)('provides localized page and browser-print labels in %s', (locale, title, print) => {
    const dictionary = getPublicOfferDictionary(locale);

    expect(dictionary.title).toBe(title);
    expect(dictionary.breadcrumbLabel).toBe(title);
    expect(dictionary.print).toBe(print);
    expect(dictionary.printHint).toMatch(/браузер/);
    for (const label of [
      dictionary.home,
      dictionary.contentsLabel,
      dictionary.helpTitle,
      dictionary.call,
      dictionary.deliveryLink,
      dictionary.returnsLink,
    ]) {
      expect(label.trim()).not.toBe('');
    }
  });
});
