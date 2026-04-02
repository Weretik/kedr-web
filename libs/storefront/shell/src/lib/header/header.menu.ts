import {
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_HEADER_LAYOUT,
} from '@storefront/data-access';
import { MegaMenuItem, MenuItem } from 'primeng/api';

export type HeaderLocale = 'uk' | 'ru';
import { localizeMenuText, menuRegions, menuText } from './header.menu.i18n';

const catalogLink = (slug: string) => ['/catalog', slug, 'products'] as const;

type HardwareSectionKey = keyof typeof CATALOG_HARDWARE_SECTIONS;

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

const buildCatalogColumns = (): MenuItem[][] =>
  CATALOG_HEADER_LAYOUT.map((column) =>
    column.map((sectionKey) => {
      const section = CATALOG_HARDWARE_SECTIONS[sectionKey];
      return catalogSection(
        section.label,
        catalogSectionImages[sectionKey],
        section.items.map((item) => ({
          label: item.label,
          routerLink: catalogLink(item.slug),
        })),
      );
    }),
  );

const buildInfoItems = (locale: HeaderLocale): MegaMenuItem['items'] => [
  [
    {
      label: localizeMenuText(menuText.about, locale),
      items: [
        {
          label: localizeMenuText(menuText.aboutCompany, locale),
          routerLink: ['/about-company'],
        },
        {
          label: localizeMenuText(menuText.deliveryAndPayment, locale),
          routerLink: ['/delivery-and-payment'],
        },
        {
          label: localizeMenuText(menuText.returnsExchanges, locale),
          routerLink: ['/returns-exchanges'],
        },
        {
          label: localizeMenuText(menuText.gallery, locale),
          routerLink: ['/galleria'],
        },
        {
          label: localizeMenuText(menuText.articles, locale),
          routerLink: ['/articles'],
        },
        {
          label: localizeMenuText(menuText.contacts, locale),
          routerLink: ['/contacts'],
        },
      ],
    },
  ],
  [
    {
      label: localizeMenuText(menuText.regions, locale),
      items: menuRegions.map((region) => ({
        label: localizeMenuText(region, locale),
        routerLink: ['/region', region.slug],
      })),
    },
  ],
  [
    {
      label: localizeMenuText(menuText.legal, locale),
      items: [
        {
          label: localizeMenuText(menuText.publicOffer, locale),
          routerLink: ['/public-offer'],
        },
        {
          label: localizeMenuText(menuText.privacyPolicy, locale),
          routerLink: ['/privacy-policy'],
        },
      ],
    },
  ],
  [
    {
      items: [
        {
          image: 'assets/images/home-page/wholesale.png',
          label: localizeMenuText(menuText.wholesale, locale),
          routerLink: '/wholesale',
          subtext: localizeMenuText(menuText.wholesaleSubtext, locale),
        },
      ],
    },
  ],
];

export function buildMenu(locale: HeaderLocale): MegaMenuItem[] {
  return [
    {
      label: localizeMenuText(menuText.catalog, locale),
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: buildCatalogColumns(),
    },
    {
      label: localizeMenuText(menuText.information, locale),
      icon: 'pi pi-exclamation-circle',
      root: true,
      items: buildInfoItems(locale),
    },
    {
      label: localizeMenuText(menuText.about, locale),
      icon: 'pi pi-id-card',
      root: true,
      routerLink: ['/about-company'],
    },
    {
      label: localizeMenuText(menuText.wholesale, locale),
      icon: 'pi pi-briefcase',
      root: true,
      routerLink: ['/wholesale'],
    },
  ];
}
