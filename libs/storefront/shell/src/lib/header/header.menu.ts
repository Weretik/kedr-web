import {
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_HEADER_LAYOUT,
} from '@storefront/data-access';
import { MegaMenuItem, MenuItem } from 'primeng/api';

const catalogLink = (slug: string) => ['/catalog', slug, 'products'] as const;

type HardwareSectionKey = keyof typeof CATALOG_HARDWARE_SECTIONS;

const catalogSectionImages: Record<HardwareSectionKey, string> = {
  hinges: '/assets/images/home-page/hero.png',
  locks: '/assets/images/home-page/hero.png',
  handles: '/assets/images/home-page/hero.png',
  cylinders: '/assets/images/home-page/hero.png',
  interiorMechanisms: '/assets/images/home-page/hero.png',
  other: '/assets/images/home-page/hero.png',
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

export function buildMenu(): MegaMenuItem[] {
  return [
    {
      label: 'Каталог',
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: buildCatalogColumns(),
    },
    {
      label: 'Інформація',
      icon: 'pi pi-exclamation-circle',
      root: true,
      items: [
        [
          {
            label: 'Про нас',
            items: [
              { label: 'Про компанію', routerLink: ['/about-company'] },
              {
                label: 'Доставка та оплата',
                routerLink: ['/delivery-and-payment'],
              },
              {
                label: 'Повернення та обмім',
                routerLink: ['/returns-exchanges'],
              },
              { label: 'Галерея та відео', routerLink: ['/galleria'] },
              { label: 'Статті', routerLink: ['/articles'] },
              { label: 'Контакти', routerLink: ['/contacts'] },
            ],
          },
        ],
        [
          {
            label: 'Регіони',
            items: [
              { label: 'Харків' },
              { label: 'Київ' },
              { label: 'Дніпро' },
              { label: 'Запоріжжя' },
              { label: 'Миколаїв' },
              { label: 'Одеса' },
              { label: 'Полтава' },
              { label: 'Кривий ріг' },
              { label: 'Миколаїв' },
              { label: 'Вінниця' },
              { label: 'Житомир' },
              { label: 'Біла церква' },
              { label: 'Суми' },
              { label: 'Чернігів' },
            ],
          },
        ],
        [
          {
            label: 'Юридична інформація',
            items: [
              { label: 'Публічна оферта', routerLink: ['/public-offer'] },
              {
                label: 'Політика конфіденційності',
                routerLink: ['/privacy-policy'],
              },
              { label: 'Реквізити', routerLink: ['/requisites'] },
            ],
          },
        ],
        [
          {
            items: [
              {
                image: '/assets/images/home-page/wholesale.png',
                label: 'Співпраця',
                routerLink: '/wholesale',
                subtext: 'Умови співпраці для оптових партнерів',
              },
            ],
          },
        ],
      ],
    },
    {
      label: 'Про нас',
      icon: 'pi pi-id-card',
      root: true,
      routerLink: ['/about-company'],
    },
    {
      label: 'Співпраця',
      icon: 'pi pi-briefcase',
      root: true,
      routerLink: ['/wholesale'],
    },
  ];
}
