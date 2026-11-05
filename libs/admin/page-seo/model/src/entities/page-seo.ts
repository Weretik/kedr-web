/** The site pages that exist once; their order follows the site menu, as on the backend. */
export const sitePages = [
  { page: 'Home', label: 'Головна', path: '/' },
  { page: 'Catalog', label: 'Каталог', path: '/catalog' },
  { page: 'Wholesale', label: 'Співпраця', path: '/wholesale' },
  { page: 'DeliveryPayment', label: 'Доставка та оплата', path: '/delivery-and-payment' },
  { page: 'ReturnsExchanges', label: 'Повернення та обмін', path: '/returns-exchanges' },
  { page: 'Contacts', label: 'Контакти', path: '/contacts' },
  { page: 'Gallery', label: 'Галерея', path: '/galleria' },
  { page: 'Articles', label: 'Статті', path: '/articles' },
  { page: 'Requisites', label: 'Реквізити', path: '/requisites' },
  { page: 'PublicOffer', label: 'Публічна оферта', path: '/public-offer' },
  { page: 'PrivacyPolicy', label: 'Політика конфіденційності', path: '/privacy-policy' },
] as const;

export type SitePage = (typeof sitePages)[number]['page'];

/** What an editor wrote; an empty string keeps the text the site has in code. */
export interface PageSeoTexts {
  titleUk: string;
  titleRu: string;
  descriptionUk: string;
  descriptionRu: string;
}

export interface PageSeoEntry {
  page: SitePage;
  label: string;
  /** Site address without the language, for the editor's orientation. */
  path: string;
  texts: PageSeoTexts;
  updatedAt: string | null;
  updatedBy: string | null;
}

/** Backend limits. */
export const pageSeoTitleMaxLength = 120;
export const pageSeoDescriptionMaxLength = 300;

/** Lengths search results usually show in full; longer is allowed but cut by Google. */
export const pageSeoTitleShownLength = 60;
export const pageSeoDescriptionShownLength = 160;

export const isSitePage = (value: string): value is SitePage =>
  sitePages.some((entry) => entry.page === value);

export const hasPageSeoTexts = (texts: PageSeoTexts) =>
  Object.values(texts).some((value) => value.trim() !== '');
