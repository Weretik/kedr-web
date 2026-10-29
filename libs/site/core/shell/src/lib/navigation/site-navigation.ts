import type { ShellDictionary } from '../i18n/shell-dictionary';

type InfoLinkKey = keyof ShellDictionary['links'];
type CategoryKey = keyof ShellDictionary['categories'];
export type RegionSlug = keyof ShellDictionary['regionNames'];

export type NavLink<Key extends string> = { key: Key; path: string };

const catalogPath = (slug: string) => `/catalog/${slug}/products`;

/** Top bar links; the same pages as in the current storefront header. Paths are locale-free. */
export const INFO_LINKS: readonly NavLink<InfoLinkKey>[] = [
  { key: 'aboutCompany', path: '/about-company' },
  { key: 'deliveryAndPayment', path: '/delivery-and-payment' },
  { key: 'returnsExchanges', path: '/returns-exchanges' },
  { key: 'gallery', path: '/galleria' },
  { key: 'articles', path: '/articles' },
  { key: 'contacts', path: '/contacts' },
];

export const LEGAL_LINKS: readonly NavLink<InfoLinkKey>[] = [
  { key: 'publicOffer', path: '/public-offer' },
  { key: 'privacyPolicy', path: '/privacy-policy' },
  { key: 'requisites', path: '/requisites' },
];

/**
 * Catalog sections in the category row. Slugs are the current category slugs, so URLs stay the same.
 * The catalog feature replaces this list with the category tree from the API and adds the mega menu.
 */
export const CATEGORY_LINKS: readonly NavLink<CategoryKey>[] = [
  { key: 'hinges', path: catalogPath('zavisi-900001') },
  { key: 'locks', path: catalogPath('zamki-900002') },
  { key: 'handles', path: catalogPath('ruchki-900003') },
  { key: 'cylinders', path: catalogPath('tsilindri-900004') },
  { key: 'interiorMechanisms', path: catalogPath('mizhkimnatni-mekhanizmi-900005') },
  { key: 'other', path: catalogPath('inshe-900006') },
  { key: 'doors', path: catalogPath('dveri-7226') },
];

export const REGION_SLUGS: readonly RegionSlug[] = [
  'vinnytska-oblast',
  'volynska-oblast',
  'dnipropetrovska-oblast',
  'zhytomyrska-oblast',
  'zakarpatska-oblast',
  'zaporizka-oblast',
  'ivano-frankivska-oblast',
  'kyivska-oblast',
  'kirovohradska-oblast',
  'lvivska-oblast',
  'mykolaivska-oblast',
  'odeska-oblast',
  'poltavska-oblast',
  'rivnenska-oblast',
  'sumska-oblast',
  'ternopilska-oblast',
  'kharkivska-oblast',
  'khersonska-oblast',
  'khmelnytska-oblast',
  'cherkaska-oblast',
  'chernihivska-oblast',
  'chernivetska-oblast',
  'kyiv',
];

export const regionPath = (slug: RegionSlug) => `/region/${slug}`;

export const SHELL_PATHS = {
  catalog: '/catalog/products',
  wholesale: '/wholesale',
  cabinet: '/cabinet',
  cart: '/checkout',
} as const;
