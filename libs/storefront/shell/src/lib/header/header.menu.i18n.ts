import { HeaderLocale } from './header.menu';

type LocalizedText = {
  uk: string;
  ru: string;
};

type RegionText = LocalizedText & {
  slug: string;
};

export const menuText = {
  catalog: { uk: 'Каталог', ru: 'Каталог' },
  information: { uk: 'Інформація', ru: 'Информация' },
  about: { uk: 'Про нас', ru: 'О нас' },
  aboutCompany: { uk: 'Про компанію', ru: 'О компании' },
  deliveryAndPayment: { uk: 'Доставка та оплата', ru: 'Доставка и оплата' },
  returnsExchanges: { uk: 'Повернення та обмін', ru: 'Возврат и обмен' },
  gallery: { uk: 'Галерея та відео', ru: 'Галерея и видео' },
  articles: { uk: 'Статті', ru: 'Статьи' },
  contacts: { uk: 'Контакти', ru: 'Контакты' },
  regions: { uk: 'Регіони', ru: 'Регионы' },
  legal: { uk: 'Юридична інформація', ru: 'Юридическая информация' },
  publicOffer: { uk: 'Публічна оферта', ru: 'Публичная оферта' },
  privacyPolicy: {
    uk: 'Політика конфіденційності',
    ru: 'Политика конфиденциальности',
  },
  wholesale: { uk: 'Співпраця', ru: 'Сотрудничество' },
  wholesaleSubtext: {
    uk: 'Умови співпраці для оптових партнерів',
    ru: 'Условия сотрудничества для оптовых партнеров',
  },
} as const satisfies Record<string, LocalizedText>;

export const menuRegions: RegionText[] = [
  {
    slug: 'vinnytska-oblast',
    uk: 'Вінницька область',
    ru: 'Винницкая область',
  },
  { slug: 'volynska-oblast', uk: 'Волинська область', ru: 'Волынская область' },
  {
    slug: 'dnipropetrovska-oblast',
    uk: 'Дніпропетровська область',
    ru: 'Днепропетровская область',
  },
  {
    slug: 'zhytomyrska-oblast',
    uk: 'Житомирська область',
    ru: 'Житомирская область',
  },
  {
    slug: 'zakarpatska-oblast',
    uk: 'Закарпатська область',
    ru: 'Закарпатская область',
  },
  {
    slug: 'zaporizka-oblast',
    uk: 'Запорізька область',
    ru: 'Запорожская область',
  },
  {
    slug: 'ivano-frankivska-oblast',
    uk: 'Івано-Франківська область',
    ru: 'Ивано-Франковская область',
  },
  { slug: 'kyivska-oblast', uk: 'Київська область', ru: 'Киевская область' },
  {
    slug: 'kirovohradska-oblast',
    uk: 'Кіровоградська область',
    ru: 'Кировоградская область',
  },
  { slug: 'lvivska-oblast', uk: 'Львівська область', ru: 'Львовская область' },
  {
    slug: 'mykolaivska-oblast',
    uk: 'Миколаївська область',
    ru: 'Николаевская область',
  },
  { slug: 'odeska-oblast', uk: 'Одеська область', ru: 'Одесская область' },
  {
    slug: 'poltavska-oblast',
    uk: 'Полтавська область',
    ru: 'Полтавская область',
  },
  {
    slug: 'rivnenska-oblast',
    uk: 'Рівненська область',
    ru: 'Ровенская область',
  },
  { slug: 'sumska-oblast', uk: 'Сумська область', ru: 'Сумская область' },
  {
    slug: 'ternopilska-oblast',
    uk: 'Тернопільська область',
    ru: 'Тернопольская область',
  },
  {
    slug: 'kharkivska-oblast',
    uk: 'Харківська область',
    ru: 'Харьковская область',
  },
  {
    slug: 'khersonska-oblast',
    uk: 'Херсонська область',
    ru: 'Херсонская область',
  },
  {
    slug: 'khmelnytska-oblast',
    uk: 'Хмельницька область',
    ru: 'Хмельницкая область',
  },
  {
    slug: 'cherkaska-oblast',
    uk: 'Черкаська область',
    ru: 'Черкасская область',
  },
  {
    slug: 'chernihivska-oblast',
    uk: 'Чернігівська область',
    ru: 'Черниговская область',
  },
  {
    slug: 'chernivetska-oblast',
    uk: 'Чернівецька область',
    ru: 'Черновицкая область',
  },
  { slug: 'kyiv', uk: 'Київ', ru: 'Киев' },
];

export const localizeMenuText = (
  text: LocalizedText,
  locale: HeaderLocale,
): string => text[locale];
