import {
  CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG,
  CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_HEADER_LAYOUT,
} from '@storefront/data-access';
import { MegaMenuItem, MenuItem } from 'primeng/api';

export type HeaderLocale = 'uk' | 'ru';

const localizedLink = (locale: HeaderLocale, ...segments: string[]) =>
  ['/', locale, ...segments] as const;

const catalogLink = (locale: HeaderLocale, slug: string) =>
  localizedLink(locale, 'catalog', slug, 'products');

type TranslateFn = (key: string) => string;
type HardwareSectionKey = keyof typeof CATALOG_HARDWARE_SECTIONS;

const menuText = {
  catalog: 'header.menu.catalog',
  information: 'header.menu.information',
  about: 'header.menu.about',
  aboutCompany: 'header.menu.aboutCompany',
  deliveryAndPayment: 'header.menu.deliveryAndPayment',
  returnsExchanges: 'header.menu.returnsExchanges',
  gallery: 'header.menu.gallery',
  articles: 'header.menu.articles',
  contacts: 'header.menu.contacts',
  regions: 'header.menu.regions',
  legal: 'header.menu.legal',
  publicOffer: 'header.menu.publicOffer',
  privacyPolicy: 'header.menu.privacyPolicy',
  wholesale: 'header.menu.wholesale',
  wholesaleSubtext: 'header.menu.wholesaleSubtext',
} as const;

const menuRegions = [
  { slug: 'vinnytska-oblast', key: 'header.menu.region.vinnytska' },
  { slug: 'volynska-oblast', key: 'header.menu.region.volynska' },
  { slug: 'dnipropetrovska-oblast', key: 'header.menu.region.dnipropetrovska' },
  { slug: 'zhytomyrska-oblast', key: 'header.menu.region.zhytomyrska' },
  { slug: 'zakarpatska-oblast', key: 'header.menu.region.zakarpatska' },
  { slug: 'zaporizka-oblast', key: 'header.menu.region.zaporizka' },
  {
    slug: 'ivano-frankivska-oblast',
    key: 'header.menu.region.ivanoFrankivska',
  },
  { slug: 'kyivska-oblast', key: 'header.menu.region.kyivska' },
  { slug: 'kirovohradska-oblast', key: 'header.menu.region.kirovohradska' },
  { slug: 'lvivska-oblast', key: 'header.menu.region.lvivska' },
  { slug: 'mykolaivska-oblast', key: 'header.menu.region.mykolaivska' },
  { slug: 'odeska-oblast', key: 'header.menu.region.odeska' },
  { slug: 'poltavska-oblast', key: 'header.menu.region.poltavska' },
  { slug: 'rivnenska-oblast', key: 'header.menu.region.rivnenska' },
  { slug: 'sumska-oblast', key: 'header.menu.region.sumska' },
  { slug: 'ternopilska-oblast', key: 'header.menu.region.ternopilska' },
  { slug: 'kharkivska-oblast', key: 'header.menu.region.kharkivska' },
  { slug: 'khersonska-oblast', key: 'header.menu.region.khersonska' },
  { slug: 'khmelnytska-oblast', key: 'header.menu.region.khmelnytska' },
  { slug: 'cherkaska-oblast', key: 'header.menu.region.cherkaska' },
  { slug: 'chernihivska-oblast', key: 'header.menu.region.chernihivska' },
  { slug: 'chernivetska-oblast', key: 'header.menu.region.chernivetska' },
  { slug: 'kyiv', key: 'header.menu.region.kyiv' },
] as const;

const catalogSectionImages: Record<HardwareSectionKey, string> = {
  hinges: 'assets/images/home-page/hero.png',
  locks: 'assets/images/home-page/hero.png',
  handles: 'assets/images/home-page/hero.png',
  cylinders: 'assets/images/home-page/hero.png',
  interiorMechanisms: 'assets/images/home-page/hero.png',
  other: 'assets/images/home-page/hero.png',
};

const catalogSection = (
  label: string,
  image: string,
  items: MenuItem[],
): MenuItem => ({
  items: [
    {
      label,
      image,
      sectionHeader: true,
    } as MenuItem,
    ...items,
  ],
});

const buildCatalogColumns = (locale: HeaderLocale): MenuItem[][] =>
  CATALOG_HEADER_LAYOUT.map((column) =>
    column.map((sectionKey) => {
      const section = CATALOG_HARDWARE_SECTIONS[sectionKey];
      const sectionKeyTranslation =
        CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS[sectionKey];
      return catalogSection(
        sectionKeyTranslation,
        catalogSectionImages[sectionKey],
        section.items.map((item) => ({
          label: CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG[item.slug] ?? item.label,
          routerLink: catalogLink(locale, item.slug),
        })),
      );
    }),
  );

const buildInfoItems = (
  translate: TranslateFn,
  locale: HeaderLocale,
): MegaMenuItem['items'] => [
  [
    {
      label: translate(menuText.about),
      items: [
        {
          label: translate(menuText.aboutCompany),
          routerLink: localizedLink(locale, 'about-company'),
        },
        {
          label: translate(menuText.deliveryAndPayment),
          routerLink: localizedLink(locale, 'delivery-and-payment'),
        },
        {
          label: translate(menuText.returnsExchanges),
          routerLink: localizedLink(locale, 'returns-exchanges'),
        },
        {
          label: translate(menuText.gallery),
          routerLink: localizedLink(locale, 'galleria'),
        },
        {
          label: translate(menuText.articles),
          routerLink: localizedLink(locale, 'articles'),
        },
        {
          label: translate(menuText.contacts),
          routerLink: localizedLink(locale, 'contacts'),
        },
      ],
    },
  ],
  [
    {
      label: translate(menuText.regions),
      items: menuRegions.map((region) => ({
        label: translate(region.key),
        routerLink: localizedLink(locale, 'region', region.slug),
      })),
    },
  ],
  [
    {
      label: translate(menuText.legal),
      items: [
        {
          label: translate(menuText.publicOffer),
          routerLink: localizedLink(locale, 'public-offer'),
        },
        {
          label: translate(menuText.privacyPolicy),
          routerLink: localizedLink(locale, 'privacy-policy'),
        },
      ],
    },
  ],
  [
    {
      items: [
        {
          image: 'assets/images/home-page/wholesale.png',
          label: translate(menuText.wholesale),
          routerLink: localizedLink(locale, 'wholesale'),
          subtext: translate(menuText.wholesaleSubtext),
        },
      ],
    },
  ],
];

export function buildMenu(
  translate: TranslateFn,
  locale: HeaderLocale,
): MegaMenuItem[] {
  const translateWithFallback = (value: string): string => {
    const translated = translate(value);
    return translated === value ? value : translated;
  };

  return [
    {
      label: translate(menuText.catalog),
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: buildCatalogColumns(locale).map((column) =>
        column.map((section) => ({
          ...section,
          items: section.items?.map((item) => ({
            ...item,
            label: item.label ? translateWithFallback(item.label) : item.label,
          })),
        })),
      ),
    },
    {
      label: translate(menuText.information),
      icon: 'pi pi-exclamation-circle',
      root: true,
      items: buildInfoItems(translate, locale),
    },
    {
      label: translate(menuText.about),
      icon: 'pi pi-id-card',
      root: true,
      routerLink: localizedLink(locale, 'about-company'),
    },
    {
      label: translate(menuText.wholesale),
      icon: 'pi pi-briefcase',
      root: true,
      routerLink: localizedLink(locale, 'wholesale'),
    },
  ];
}
