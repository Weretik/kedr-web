import type { PrivacyContactBindings, PrivacyDictionary } from './privacy-types';
import type { Locale } from '@site/core/i18n';

type PrivacyUiCopy = Omit<PrivacyDictionary, 'locale' | 'contact'>;

const uiCopy: Readonly<Record<Locale, PrivacyUiCopy>> = {
  uk: {
    breadcrumbLabel: 'Хлібні крихти',
    home: 'Головна',
    title: 'Політика конфіденційності',
    intro: 'Як ми обробляємо персональні дані під час користування сайтом та оформлення замовлень.',
    contentsLabel: 'Зміст політики',
    summary: [
      {
        id: 'data',
        title: 'Які дані збираємо',
        body: 'Телефон, ім’я за вашим бажанням та склад замовлення.',
      },
      {
        id: 'purpose',
        title: 'Для чого',
        body: 'Зв’язок щодо заявки, узгодження оплати й доставки.',
      },
      {
        id: 'rights',
        title: 'Ваші права',
        body: 'Дізнатися про свої дані, виправити їх або звернутися щодо видалення.',
      },
    ],
    contactTitle: 'Маєте запитання щодо даних?',
    contactAction: 'Написати нам',
    relatedOffer: {
      heading: 'Інша інформація',
      title: 'Публічна оферта',
      description: 'Публічна оферта та правила користування сайтом (змішаний договір).',
    },
  },
  ru: {
    breadcrumbLabel: 'Хлебные крошки',
    home: 'Главная',
    title: 'Политика конфиденциальности',
    intro: 'Как мы обрабатываем персональные данные при использовании сайта и оформлении заказов.',
    contentsLabel: 'Содержание политики',
    summary: [
      {
        id: 'data',
        title: 'Какие данные собираем',
        body: 'Телефон, имя по вашему желанию и состав заказа.',
      },
      {
        id: 'purpose',
        title: 'Для чего',
        body: 'Связь по заявке, согласование оплаты и доставки.',
      },
      {
        id: 'rights',
        title: 'Ваши права',
        body: 'Узнать о своих данных, исправить их или обратиться по вопросу удаления.',
      },
    ],
    contactTitle: 'Есть вопросы о ваших данных?',
    contactAction: 'Написать нам',
    relatedOffer: {
      heading: 'Другая информация',
      title: 'Публичная оферта',
      description: 'Публичная оферта и правила пользования сайтом (смешанный договор).',
    },
  },
};

/** Page chrome of the privacy policy; the policy text itself is the published document. */
export function getPrivacyDictionary(
  locale: Locale,
  contact: PrivacyContactBindings,
): PrivacyDictionary {
  return { ...uiCopy[locale], locale, contact };
}
