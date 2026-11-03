import { PUBLIC_OFFER_SOURCE_COPY } from './public-offer-source-copy';
import { PUBLIC_OFFER_UI_COPY } from './public-offer-ui-copy';

import type { PublicOfferDictionary, PublicOfferSection } from './public-offer-types';
import type { Locale } from '@site/core/i18n';

const SECTION_TARGETS = [
  { index: 0, id: 'offer-general' },
  { index: 1, id: 'offer-site-use' },
  { index: 2, id: 'offer-payment' },
  { index: 3, id: 'offer-delivery' },
  { index: 4, id: 'offer-returns' },
  { index: 5, id: 'offer-personal-data' },
  { index: 6, id: 'offer-final' },
] as const;

function sentenceCase(value: string, locale: Locale): string {
  return value
    .toLocaleLowerCase(locale)
    .replace(/\p{L}/u, (letter) => letter.toLocaleUpperCase(locale));
}

function displayHeading(
  heading: string,
  locale: Locale,
): Pick<PublicOfferSection, 'title' | 'subtitle'> {
  const subtitleIndex = heading.indexOf(' (');
  if (subtitleIndex === -1) return { title: sentenceCase(heading, locale) };

  return {
    title: sentenceCase(heading.slice(0, subtitleIndex), locale),
    subtitle: sentenceCase(heading.slice(subtitleIndex + 1), locale),
  };
}

export function getPublicOfferDictionary(locale: Locale): PublicOfferDictionary {
  const source = PUBLIC_OFFER_SOURCE_COPY[locale];
  const { tocLabels, ...uiCopy } = PUBLIC_OFFER_UI_COPY[locale];

  return {
    locale,
    ...uiCopy,
    fullTitle: source.fullTitle,
    sections: SECTION_TARGETS.map(({ index, id }) => {
      const section = source.sections[index];
      return {
        id,
        ...displayHeading(section.heading, locale),
        tocLabel: tocLabels[index],
        paragraphs: section.paragraphs,
      };
    }),
    note: source.note,
  };
}
