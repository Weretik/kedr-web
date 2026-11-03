import { ruPrivacyPolicy, ukPrivacyPolicy } from './privacy-policy-copy';
import { buildPrivacyPolicySections, type PrivacyTocLabels } from './privacy-policy-sections';

import type { PrivacyDictionary, PrivacyPolicyBindings } from './privacy-types';
import type { Locale } from '@site/core/i18n';

type PrivacyUiCopy = Omit<PrivacyDictionary, 'locale' | 'sections' | 'contact' | 'relatedOffer'> & {
  readonly tocLabels: PrivacyTocLabels;
};

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
    tocLabels: [
      'Загальні положення',
      'Склад персональних даних',
      'Мета обробки',
      'Передача третім особам',
      'Захист та збереження',
      'Права користувача',
      'Зміни у політиці',
      'Контактна інформація',
    ],
    contactTitle: 'Маєте запитання щодо даних?',
    contactAction: 'Написати нам',
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
    tocLabels: [
      'Общие положения',
      'Состав персональных данных',
      'Цель обработки',
      'Передача третьим лицам',
      'Защита и хранение',
      'Права пользователя',
      'Изменения политики',
      'Контактная информация',
    ],
    contactTitle: 'Есть вопросы о ваших данных?',
    contactAction: 'Написать нам',
  },
};

/** Builds local page copy without reading environment, config, or remote data. */
export function getPrivacyDictionary(
  locale: Locale,
  bindings: PrivacyPolicyBindings,
): PrivacyDictionary {
  const source = locale === 'uk' ? ukPrivacyPolicy : ruPrivacyPolicy;
  const { tocLabels, ...copy } = uiCopy[locale];

  return {
    ...copy,
    locale,
    sections: buildPrivacyPolicySections(source, bindings, tocLabels),
    contact: {
      email: bindings.email,
      phoneDisplay: bindings.phoneDisplay,
      phoneHref: bindings.phoneHref,
    },
    relatedOffer: {
      heading: source['privacy.sidebar.title'],
      title: source['privacy.sidebar.card.title'],
      description: source['privacy.sidebar.card.subtitle'],
    },
  };
}
