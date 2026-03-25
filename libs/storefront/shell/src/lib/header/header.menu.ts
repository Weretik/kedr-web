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
                label: 'Повернення та обмін',
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
              {
                label: 'Вінницька область',
                routerLink: ['/region', 'vinnytska-oblast'],
              },
              {
                label: 'Волинська область',
                routerLink: ['/region', 'volynska-oblast'],
              },
              {
                label: 'Дніпропетровська область',
                routerLink: ['/region', 'dnipropetrovska-oblast'],
              },
              {
                label: 'Житомирська область',
                routerLink: ['/region', 'zhytomyrska-oblast'],
              },
              {
                label: 'Закарпатська область',
                routerLink: ['/region', 'zakarpatska-oblast'],
              },
              {
                label: 'Запорізька область',
                routerLink: ['/region', 'zaporizka-oblast'],
              },
              {
                label: 'Івано-Франківська область',
                routerLink: ['/region', 'ivano-frankivska-oblast'],
              },
              {
                label: 'Київська область',
                routerLink: ['/region', 'kyivska-oblast'],
              },
              {
                label: 'Кіровоградська область',
                routerLink: ['/region', 'kirovohradska-oblast'],
              },
              {
                label: 'Львівська область',
                routerLink: ['/region', 'lvivska-oblast'],
              },
              {
                label: 'Миколаївська область',
                routerLink: ['/region', 'mykolaivska-oblast'],
              },
              {
                label: 'Одеська область',
                routerLink: ['/region', 'odeska-oblast'],
              },
              {
                label: 'Полтавська область',
                routerLink: ['/region', 'poltavska-oblast'],
              },
              {
                label: 'Рівненська область',
                routerLink: ['/region', 'rivnenska-oblast'],
              },
              {
                label: 'Сумська область',
                routerLink: ['/region', 'sumska-oblast'],
              },
              {
                label: 'Тернопільська область',
                routerLink: ['/region', 'ternopilska-oblast'],
              },
              {
                label: 'Харківська область',
                routerLink: ['/region', 'kharkivska-oblast'],
              },
              {
                label: 'Херсонська область',
                routerLink: ['/region', 'khersonska-oblast'],
              },
              {
                label: 'Хмельницька область',
                routerLink: ['/region', 'khmelnytska-oblast'],
              },
              {
                label: 'Черкаська область',
                routerLink: ['/region', 'cherkaska-oblast'],
              },
              {
                label: 'Чернігівська область',
                routerLink: ['/region', 'chernihivska-oblast'],
              },
              {
                label: 'Чернівецька область',
                routerLink: ['/region', 'chernivetska-oblast'],
              },
              {
                label: 'Київ',
                routerLink: ['/region', 'kyiv'],
              },
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
