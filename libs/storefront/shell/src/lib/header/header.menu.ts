import {
  getCatalogHardwareSectionLabel,
  getCatalogItemLabel,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_HEADER_LAYOUT,
} from '@storefront/data-access';
import { MegaMenuItem, MenuItem } from 'primeng/api';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

export type HeaderLocale = 'uk' | 'ru';

const catalogLink = (slug: string) => ['/catalog', slug, 'products'] as const;

type HardwareSectionKey = keyof typeof CATALOG_HARDWARE_SECTIONS;
type RegionMenuItem = { slug: string; label: string };

const menuText = {
  catalog: $localize`:@@header.menu.catalog:Каталог`,
  information: $localize`:@@header.menu.information:Інформація`,
  about: $localize`:@@header.menu.about:Про нас`,
  aboutCompany: $localize`:@@header.menu.aboutCompany:Про компанію`,
  deliveryAndPayment: $localize`:@@header.menu.deliveryAndPayment:Доставка та оплата`,
  returnsExchanges: $localize`:@@header.menu.returnsExchanges:Повернення та обмін`,
  gallery: $localize`:@@header.menu.gallery:Галерея та відео`,
  articles: $localize`:@@header.menu.articles:Статті`,
  contacts: $localize`:@@header.menu.contacts:Контакти`,
  regions: $localize`:@@header.menu.regions:Регіони`,
  legal: $localize`:@@header.menu.legal:Юридична інформація`,
  publicOffer: $localize`:@@header.menu.publicOffer:Публічна оферта`,
  privacyPolicy: $localize`:@@header.menu.privacyPolicy:Політика конфіденційності`,
  wholesale: $localize`:@@header.menu.wholesale:Співпраця`,
  wholesaleSubtext: $localize`:@@header.menu.wholesaleSubtext:Умови співпраці для оптових партнерів`,
} as const;

const menuRegions: RegionMenuItem[] = [
  {
    slug: 'vinnytska-oblast',
    label: $localize`:@@header.menu.region.vinnytska:Вінницька область`,
  },
  {
    slug: 'volynska-oblast',
    label: $localize`:@@header.menu.region.volynska:Волинська область`,
  },
  {
    slug: 'dnipropetrovska-oblast',
    label: $localize`:@@header.menu.region.dnipropetrovska:Дніпропетровська область`,
  },
  {
    slug: 'zhytomyrska-oblast',
    label: $localize`:@@header.menu.region.zhytomyrska:Житомирська область`,
  },
  {
    slug: 'zakarpatska-oblast',
    label: $localize`:@@header.menu.region.zakarpatska:Закарпатська область`,
  },
  {
    slug: 'zaporizka-oblast',
    label: $localize`:@@header.menu.region.zaporizka:Запорізька область`,
  },
  {
    slug: 'ivano-frankivska-oblast',
    label: $localize`:@@header.menu.region.ivanoFrankivska:Івано-Франківська область`,
  },
  {
    slug: 'kyivska-oblast',
    label: $localize`:@@header.menu.region.kyivska:Київська область`,
  },
  {
    slug: 'kirovohradska-oblast',
    label: $localize`:@@header.menu.region.kirovohradska:Кіровоградська область`,
  },
  {
    slug: 'lvivska-oblast',
    label: $localize`:@@header.menu.region.lvivska:Львівська область`,
  },
  {
    slug: 'mykolaivska-oblast',
    label: $localize`:@@header.menu.region.mykolaivska:Миколаївська область`,
  },
  {
    slug: 'odeska-oblast',
    label: $localize`:@@header.menu.region.odeska:Одеська область`,
  },
  {
    slug: 'poltavska-oblast',
    label: $localize`:@@header.menu.region.poltavska:Полтавська область`,
  },
  {
    slug: 'rivnenska-oblast',
    label: $localize`:@@header.menu.region.rivnenska:Рівненська область`,
  },
  {
    slug: 'sumska-oblast',
    label: $localize`:@@header.menu.region.sumska:Сумська область`,
  },
  {
    slug: 'ternopilska-oblast',
    label: $localize`:@@header.menu.region.ternopilska:Тернопільська область`,
  },
  {
    slug: 'kharkivska-oblast',
    label: $localize`:@@header.menu.region.kharkivska:Харківська область`,
  },
  {
    slug: 'khersonska-oblast',
    label: $localize`:@@header.menu.region.khersonska:Херсонська область`,
  },
  {
    slug: 'khmelnytska-oblast',
    label: $localize`:@@header.menu.region.khmelnytska:Хмельницька область`,
  },
  {
    slug: 'cherkaska-oblast',
    label: $localize`:@@header.menu.region.cherkaska:Черкаська область`,
  },
  {
    slug: 'chernihivska-oblast',
    label: $localize`:@@header.menu.region.chernihivska:Чернігівська область`,
  },
  {
    slug: 'chernivetska-oblast',
    label: $localize`:@@header.menu.region.chernivetska:Чернівецька область`,
  },
  {
    slug: 'kyiv',
    label: $localize`:@@header.menu.region.kyiv:Київ`,
  },
];

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
        getCatalogHardwareSectionLabel(sectionKey),
        catalogSectionImages[sectionKey],
        section.items.map((item) => ({
          label: getCatalogItemLabel(item.slug, item.label),
          routerLink: catalogLink(item.slug),
        })),
      );
    }),
  );

const buildInfoItems = (): MegaMenuItem['items'] => [
  [
    {
      label: menuText.about,
      items: [
        {
          label: menuText.aboutCompany,
          routerLink: ['/about-company'],
        },
        {
          label: menuText.deliveryAndPayment,
          routerLink: ['/delivery-and-payment'],
        },
        {
          label: menuText.returnsExchanges,
          routerLink: ['/returns-exchanges'],
        },
        {
          label: menuText.gallery,
          routerLink: ['/galleria'],
        },
        {
          label: menuText.articles,
          routerLink: ['/articles'],
        },
        {
          label: menuText.contacts,
          routerLink: ['/contacts'],
        },
      ],
    },
  ],
  [
    {
      label: menuText.regions,
      items: menuRegions.map((region) => ({
        label: region.label,
        routerLink: ['/region', region.slug],
      })),
    },
  ],
  [
    {
      label: menuText.legal,
      items: [
        {
          label: menuText.publicOffer,
          routerLink: ['/public-offer'],
        },
        {
          label: menuText.privacyPolicy,
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
          label: menuText.wholesale,
          routerLink: '/wholesale',
          subtext: menuText.wholesaleSubtext,
        },
      ],
    },
  ],
];

export function buildMenu(): MegaMenuItem[] {
  return [
    {
      label: menuText.catalog,
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: buildCatalogColumns(),
    },
    {
      label: menuText.information,
      icon: 'pi pi-exclamation-circle',
      root: true,
      items: buildInfoItems(),
    },
    {
      label: menuText.about,
      icon: 'pi pi-id-card',
      root: true,
      routerLink: ['/about-company'],
    },
    {
      label: menuText.wholesale,
      icon: 'pi pi-briefcase',
      root: true,
      routerLink: ['/wholesale'],
    },
  ];
}
