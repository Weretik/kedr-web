import type { PublicOfferDictionary } from './public-offer-types';
import type { Locale } from '@site/core/i18n';

type PublicOfferUiCopy = Omit<PublicOfferDictionary, 'locale'>;

export const PUBLIC_OFFER_UI_COPY = {
  uk: {
    title: 'Публічна оферта',
    home: 'Головна',
    breadcrumbLabel: 'Публічна оферта',
    contentsLabel: 'Зміст документа',
    helpTitle: 'Потрібна допомога?',
    call: 'Зателефонувати',
    deliveryLink: 'Доставка та оплата',
    returnsLink: 'Повернення та обмін',
    print: 'Друкувати',
    printHint: 'Для друку документа скористайтеся командою «Друк» у меню браузера.',
  },
  ru: {
    title: 'Публичная оферта',
    home: 'Главная',
    breadcrumbLabel: 'Публичная оферта',
    contentsLabel: 'Содержание документа',
    helpTitle: 'Нужна помощь?',
    call: 'Позвонить',
    deliveryLink: 'Доставка и оплата',
    returnsLink: 'Возврат и обмен',
    print: 'Печатать',
    printHint: 'Для печати документа воспользуйтесь командой «Печать» в меню браузера.',
  },
} as const satisfies Readonly<Record<Locale, PublicOfferUiCopy>>;
