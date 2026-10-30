import type { Locale } from '@site/core/i18n';

export type HomeDictionary = {
  heading: string;
  lead: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchSubmit: string;
  searchHint: string;
  wholesaleTitle: string;
  wholesaleBenefits: readonly string[];
  wholesaleCta: string;
  wholesaleCall: string;
  catalogTitle: string;
  catalogAll: string;
  catalogUnavailable: string;
  inStockTitle: string;
  inStockAll: string;
  factsTitle: string;
  facts: readonly { title: string; text: string }[];
};

const DICTIONARIES: Record<Locale, HomeDictionary> = {
  uk: {
    heading: 'Дверна фурнітура оптом і в роздріб',
    lead: 'Завіси, замки, ручки, циліндри та міжкімнатні механізми зі складу в Харкові. Працюємо з магазинами, монтажниками й виробниками дверей, приймаємо роздрібні замовлення та доставляємо по всій Україні.',
    searchLabel: 'Пошук товару',
    searchPlaceholder: 'Артикул або назва товару',
    searchSubmit: 'Знайти',
    searchHint: 'Шукайте за артикулом або назвою.',
    wholesaleTitle: 'Оптовим партнерам',
    wholesaleBenefits: [
      'Гнучкі оптові ціни',
      'Обсяги під ваш запит',
      'Резерв товару на складі',
      'Особистий менеджер',
    ],
    wholesaleCta: 'Стати партнером',
    wholesaleCall: 'Подзвонити',
    catalogTitle: 'Каталог дверної фурнітури',
    catalogAll: 'Усі товари',
    catalogUnavailable:
      'Каталог тимчасово не завантажився. Спробуйте відкрити список усіх товарів.',
    inStockTitle: 'Є на складі',
    inStockAll: 'Дивитися всі товари',
    factsTitle: 'Чому Class Kedr',
    facts: [
      {
        title: 'Завжди на складі',
        text: 'Ходові позиції в наявності, відвантаження без очікування.',
      },
      {
        title: 'Оптом і в роздріб',
        text: 'Ціни для партнерів і зручні замовлення від однієї штуки.',
      },
      { title: 'Доставка по Україні', text: 'Відправляємо Новою поштою в будь-яке місто.' },
    ],
  },
  ru: {
    heading: 'Дверная фурнитура оптом и в розницу',
    lead: 'Петли, замки, ручки, цилиндры и межкомнатные механизмы со склада в Харькове. Работаем с магазинами, монтажниками и производителями дверей, принимаем розничные заказы и доставляем по всей Украине.',
    searchLabel: 'Поиск товара',
    searchPlaceholder: 'Артикул или название товара',
    searchSubmit: 'Найти',
    searchHint: 'Ищите по артикулу или названию.',
    wholesaleTitle: 'Оптовым партнерам',
    wholesaleBenefits: [
      'Гибкие оптовые цены',
      'Объемы под ваш запрос',
      'Резерв товара на складе',
      'Личный менеджер',
    ],
    wholesaleCta: 'Стать партнером',
    wholesaleCall: 'Позвонить',
    catalogTitle: 'Каталог дверной фурнитуры',
    catalogAll: 'Все товары',
    catalogUnavailable: 'Каталог временно не загрузился. Попробуйте открыть список всех товаров.',
    inStockTitle: 'Есть на складе',
    inStockAll: 'Смотреть все товары',
    factsTitle: 'Почему Class Kedr',
    facts: [
      { title: 'Всегда на складе', text: 'Ходовые позиции в наличии, отгрузка без ожидания.' },
      { title: 'Оптом и в розницу', text: 'Цены для партнеров и удобные заказы от одной штуки.' },
      { title: 'Доставка по Украине', text: 'Отправляем Новой почтой в любой город.' },
    ],
  },
};

export function getHomeDictionary(locale: Locale): HomeDictionary {
  return DICTIONARIES[locale];
}
