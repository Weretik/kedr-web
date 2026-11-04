import type { Locale } from '@site/core/i18n';

/** Page chrome of delivery & payment; the terms themselves are the published document. */
const copy = {
  uk: {
    title: 'Доставка та оплата',
    home: 'Головна',
    breadcrumbs: 'Хлібні крихти',
    sectionNavigation: 'Розділи сторінки',
    question: 'Маєте запитання?',
    call: 'Зателефонувати',
  },
  ru: {
    title: 'Доставка и оплата',
    home: 'Главная',
    breadcrumbs: 'Хлебные крошки',
    sectionNavigation: 'Разделы страницы',
    question: 'Есть вопросы?',
    call: 'Позвонить',
  },
} as const;

export type DeliveryPaymentDictionary = (typeof copy)[Locale];

export function getDeliveryPaymentDictionary(locale: Locale): DeliveryPaymentDictionary {
  return copy[locale];
}
