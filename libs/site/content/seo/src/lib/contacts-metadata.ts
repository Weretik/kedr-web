import { COMPANY, siteConfig } from '@site/core/config';
import { buildPageMetadata } from '@site/core/seo';

import type { SiteConfig } from '@site/core/config';
import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

export const CONTACTS_PATH = '/contacts';

export function buildContactsMetadata(locale: Locale, config: SiteConfig = siteConfig): Metadata {
  const text =
    locale === 'uk'
      ? {
          title: 'Контакти — зв’язок із відділом продажу',
          description: `Контакти ${COMPANY.name}, ${COMPANY.address.city.uk}: телефон ${COMPANY.phone.display}, Telegram, Viber та електронна пошта. Дверна фурнітура оптом і в роздріб.`,
        }
      : {
          title: 'Контакты — связь с отделом продаж',
          description: `Контакты ${COMPANY.name}, ${COMPANY.address.city.ru}: телефон ${COMPANY.phone.display}, Telegram, Viber и электронная почта. Дверная фурнитура оптом и в розницу.`,
        };
  return buildPageMetadata({ locale, path: CONTACTS_PATH, ...text }, config);
}
