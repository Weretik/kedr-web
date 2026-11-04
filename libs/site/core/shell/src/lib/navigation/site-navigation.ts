import type { ShellDictionary } from '../i18n/shell-dictionary';

type InfoLinkKey = keyof ShellDictionary['links'];
type CategoryKey = keyof ShellDictionary['categories'];

export type NavLink<Key extends string> = { key: Key; path: string; hash?: string };

const catalogPath = (slug: string) => `/catalog/${slug}`;

/** Top bar links; the same pages as in the current storefront header. Paths are locale-free. */
export const INFO_LINKS: readonly NavLink<InfoLinkKey>[] = [
  { key: 'aboutCompany', path: '/', hash: 'about-company' },
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
 * Fallback catalog sections for the category row and mobile menu when the category tree is unavailable.
 * The app layout normally passes the sections from the API through `CatalogNavigation`; a former slug here
 * still reaches the right page through the category's permanent redirect.
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

export const SHELL_PATHS = {
  catalog: '/catalog',
  search: '/search',
  wholesale: '/wholesale',
  cart: '/checkout',
} as const;
