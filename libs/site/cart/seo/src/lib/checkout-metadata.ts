import { siteConfig } from '@site/core/config';
import { buildRobotsMeta } from '@site/core/seo';

import type { Locale } from '@site/core/i18n';
import type { Metadata } from 'next';

export function buildCheckoutMetadata(
  locale: Locale,
  config: { indexingEnabled: boolean } = siteConfig,
): Metadata {
  return {
    title: locale === 'uk' ? 'Оформлення замовлення' : 'Оформление заказа',
    description:
      locale === 'uk'
        ? 'Перевірте товари та залиште контакти для швидкого замовлення Class Kedr.'
        : 'Проверьте товары и оставьте контакты для быстрого заказа Class Kedr.',
    robots: buildRobotsMeta(config, false),
  };
}
