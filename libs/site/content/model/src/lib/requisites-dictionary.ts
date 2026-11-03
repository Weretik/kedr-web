import type { RequisitesDictionary } from './requisites-types';
import type { Locale } from '@site/core/i18n';

const REQUISITES_DICTIONARIES: Record<Locale, RequisitesDictionary> = {
  uk: {
    locale: 'uk',
    home: 'Головна',
    breadcrumbLabel: 'Навігаційний ланцюжок',
    title: 'Реквізити',
    intro: 'Офіційні дані адміністрації сайту ClassKedr.',
    paymentNote: 'Реквізити для оплати замовлення уточнюйте у менеджера.',
    navigationLabel: 'Розділи реквізитів',
    administrationLink: 'Адміністрація',
    administrationTitle: 'Адміністрація сайту',
    bankLink: 'Банківські реквізити',
    bankTitle: 'Банківські реквізити',
    paymentLink: 'Оплата',
    fields: {
      legalName: 'Найменування',
      code: 'Код',
      registrationExtractNumber: 'Виписка',
      iban: 'IBAN',
      bankName: 'Банк',
      bankCode: 'МФО',
    },
    copy: {
      iban: 'Скопіювати IBAN',
      all: 'Скопіювати всі реквізити',
      copied: 'Скопійовано',
      fallback: 'Не вдалося скопіювати. Виділіть і скопіюйте дані вручну або спробуйте ще раз.',
    },
    paymentTitle: 'Перед оплатою замовлення',
    paymentText:
      'Погодьте з менеджером наявність, остаточну суму та реквізити для вашого замовлення.',
    deliveryLink: 'Доставка та оплата',
    legalTitle: 'Правова інформація',
    publicOfferLink: 'Публічна оферта',
    privacyPolicyLink: 'Політика конфіденційності',
    helpTitle: 'Маєте запитання?',
    call: 'Зателефонувати',
  },
  ru: {
    locale: 'ru',
    home: 'Главная',
    breadcrumbLabel: 'Навигационная цепочка',
    title: 'Реквизиты',
    intro: 'Официальные данные администрации сайта ClassKedr.',
    paymentNote: 'Реквизиты для оплаты заказа уточняйте у менеджера.',
    navigationLabel: 'Разделы реквизитов',
    administrationLink: 'Администрация',
    administrationTitle: 'Администрация сайта',
    bankLink: 'Банковские реквизиты',
    bankTitle: 'Банковские реквизиты',
    paymentLink: 'Оплата',
    fields: {
      legalName: 'Наименование',
      code: 'Код',
      registrationExtractNumber: 'Выписка',
      iban: 'IBAN',
      bankName: 'Банк',
      bankCode: 'МФО',
    },
    copy: {
      iban: 'Скопировать IBAN',
      all: 'Скопировать все реквизиты',
      copied: 'Скопировано',
      fallback:
        'Не удалось скопировать. Выделите и скопируйте данные вручную или попробуйте ещё раз.',
    },
    paymentTitle: 'Перед оплатой заказа',
    paymentText:
      'Согласуйте с менеджером наличие, окончательную сумму и реквизиты для вашего заказа.',
    deliveryLink: 'Доставка и оплата',
    legalTitle: 'Правовая информация',
    publicOfferLink: 'Публичная оферта',
    privacyPolicyLink: 'Политика конфиденциальности',
    helpTitle: 'Есть вопросы?',
    call: 'Позвонить',
  },
};

export function getRequisitesDictionary(locale: Locale): RequisitesDictionary {
  return REQUISITES_DICTIONARIES[locale];
}
