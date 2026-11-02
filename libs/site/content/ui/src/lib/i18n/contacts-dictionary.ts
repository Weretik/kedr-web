import type { Locale } from '@site/core/i18n';

export type ContactsDictionary = {
  breadcrumbs: string;
  home: string;
  heading: string;
  lead: string;
  sales: string;
  salesDescription: string;
  call: string;
  callHint: string;
  copyLabel: string;
  copiedLabel: string;
  errorLabel: string;
  writtenHeading: string;
  writtenHint: string;
  email: string;
  locationHeading: string;
  cityPrefix: string;
  visitHint: string;
  map: string;
  wholesaleHeading: string;
  wholesaleDescription: string;
  wholesaleChecklist: readonly string[];
  wholesaleAction: string;
};

const dictionaries: Record<Locale, ContactsDictionary> = {
  uk: {
    breadcrumbs: 'Навігаційний ланцюжок',
    home: 'Головна',
    heading: 'Контакти',
    lead: 'Допоможемо з асортиментом, наявністю та замовленням. Оберіть зручний спосіб зв’язку.',
    sales: 'Відділ продажу',
    salesDescription: 'Дверна фурнітура оптом і в роздріб.',
    call: 'Зателефонувати',
    callHint: 'Підкажемо ціну та наявність',
    copyLabel: 'Скопіювати номер телефону',
    copiedLabel: 'Номер скопійовано',
    errorLabel: 'Не вдалося скопіювати. Виділіть номер і скопіюйте вручну.',
    writtenHeading: 'Зручніше написати?',
    writtenHint: 'Надішліть артикул, фото або список товарів.',
    email: 'Електронна пошта',
    locationHeading: 'Ми у Харкові',
    cityPrefix: 'Україна, м.',
    visitHint: 'Перед візитом уточніть у менеджера час та місце зустрічі.',
    map: 'Відкрити Google Maps',
    wholesaleHeading: 'Для оптових замовлень',
    wholesaleDescription:
      'Підготуйте артикули та кількість товарів — менеджер уточнить умови вашого замовлення.',
    wholesaleChecklist: ['Артикул або фото товару', 'Потрібна кількість', 'Місто доставки'],
    wholesaleAction: 'Написати в Telegram',
  },
  ru: {
    breadcrumbs: 'Навигационная цепочка',
    home: 'Главная',
    heading: 'Контакты',
    lead: 'Поможем с ассортиментом, наличием и заказом. Выберите удобный способ связи.',
    sales: 'Отдел продаж',
    salesDescription: 'Дверная фурнитура оптом и в розницу.',
    call: 'Позвонить',
    callHint: 'Подскажем цену и наличие',
    copyLabel: 'Скопировать номер телефона',
    copiedLabel: 'Номер скопирован',
    errorLabel: 'Не удалось скопировать. Выделите номер и скопируйте вручную.',
    writtenHeading: 'Удобнее написать?',
    writtenHint: 'Пришлите артикул, фото или список товаров.',
    email: 'Электронная почта',
    locationHeading: 'Мы в Харькове',
    cityPrefix: 'Украина, г.',
    visitHint: 'Перед визитом уточните у менеджера время и место встречи.',
    map: 'Открыть Google Maps',
    wholesaleHeading: 'Для оптовых заказов',
    wholesaleDescription:
      'Подготовьте артикулы и количество товаров — менеджер уточнит условия вашего заказа.',
    wholesaleChecklist: ['Артикул или фото товара', 'Нужное количество', 'Город доставки'],
    wholesaleAction: 'Написать в Telegram',
  },
};

export function getContactsDictionary(locale: Locale): ContactsDictionary {
  return dictionaries[locale];
}
