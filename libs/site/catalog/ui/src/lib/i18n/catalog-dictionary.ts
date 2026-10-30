import type { Locale } from '@site/core/i18n';

export type CatalogDictionary = {
  /** Link to a whole category when only part of its subcategories is shown. */
  allInCategory: (count: number) => string;
  priceOnRequest: string;
  retailPrice: string;
  isNew: string;
  isSale: string;
  currency: string;
};

const DICTIONARIES: Record<Locale, CatalogDictionary> = {
  uk: {
    allInCategory: (count) => `Усі ${count}`,
    priceOnRequest: 'Ціна за запитом',
    retailPrice: 'Роздрібна ціна',
    isNew: 'Новинка',
    isSale: 'Акція',
    currency: 'грн',
  },
  ru: {
    allInCategory: (count) => `Все ${count}`,
    priceOnRequest: 'Цена по запросу',
    retailPrice: 'Розничная цена',
    isNew: 'Новинка',
    isSale: 'Акция',
    currency: 'грн',
  },
};

export function getCatalogDictionary(locale: Locale): CatalogDictionary {
  return DICTIONARIES[locale];
}
