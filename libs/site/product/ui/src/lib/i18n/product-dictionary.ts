import { ru } from './ru';
import { uk } from './uk';

import type { Locale } from '@site/core/i18n';

export type ProductDictionary = { [Key in keyof typeof uk]: string };

const dictionaries: Record<Locale, ProductDictionary> = { uk, ru };

export const getProductDictionary = (locale: Locale): ProductDictionary => dictionaries[locale];
