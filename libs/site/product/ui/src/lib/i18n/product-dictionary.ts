import { ru } from './locales/ru';
import { uk } from './locales/uk';

import type { Locale } from '@site/core/i18n';

export type ProductDictionary = { [Key in keyof typeof uk]: string };

const dictionaries: Record<Locale, ProductDictionary> = { uk, ru };

export const getProductDictionary = (locale: Locale): ProductDictionary => dictionaries[locale];
