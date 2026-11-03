import type { PublicOfferDictionary } from './public-offer-types';
import type { Locale } from '@site/core/i18n';

type PublicOfferUiCopy = Omit<
  PublicOfferDictionary,
  'locale' | 'fullTitle' | 'sections' | 'note'
> & {
  readonly tocLabels: readonly string[];
};

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
    tocLabels: [
      '1. Загальні положення та преамбула',
      '2. Правила користування сайтом',
      '3. Ціна та оплата',
      '4. Доставка та відповідальність',
      '5. Повернення товару',
      '6. Персональні дані',
      '7. Прикінцеві положення',
    ],
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
    tocLabels: [
      '1. Общие положения и преамбула',
      '2. Правила пользования сайтом',
      '3. Цена и оплата',
      '4. Доставка и ответственность',
      '5. Возврат товара',
      '6. Персональные данные',
      '7. Заключительные положения',
    ],
  },
} as const satisfies Readonly<Record<Locale, PublicOfferUiCopy>>;
