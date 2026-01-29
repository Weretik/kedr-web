import { MegaMenuItem } from 'primeng/api';

const catalogLink = (slug: string) => ['/catalog', slug, 'products'] as const;

export function buildMenu(): MegaMenuItem[] {
  return [
    {
      label: 'Каталог',
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: [
        [
          {
            label: 'Завіси',
            items: [
              {
                label: 'Накладні(метелик)',
                routerLink: catalogLink(
                  'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707',
                ),
              },
              {
                label: 'Ввертні та приварні',
                routerLink: catalogLink(
                  'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457',
                ),
              },
              {
                label: 'Врізні',
                routerLink: catalogLink(
                  'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139',
                ),
              },
            ],
          },
          {
            label: 'Замки',
            items: [
              {
                label: 'Навестні та велозамки',
                routerLink: catalogLink('kedr-zamki-navisni-ta-velozamki-1304'),
              },
              {
                label: 'Комплекти з ручками',
                routerLink: catalogLink('kedr-komplekti-zamki-z-ruchkami-2716'),
              },
              {
                label: 'Накладні',
                routerLink: catalogLink('kedr-zamki-nakladni-2722'),
              },
              {
                label: 'Сувальдні та з хрестообр. ключем',
                routerLink: catalogLink(
                  'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775',
                ),
              },
              {
                label: 'Врiзні під циліндр',
                routerLink: catalogLink('kedr-zamki-vrizni-pid-tsilindr-5851'),
              },
            ],
          },
        ],
        [
          {
            label: 'Ручки',
            items: [
              {
                label: 'На розетцi (Kevlar)',
                routerLink: catalogLink(
                  'kedr-ruchki-na-rozettsi-seriia-kevlar-26949',
                ),
              },
              {
                label: 'На планці',
                routerLink: catalogLink(
                  'kedr-ruchki-na-rozettsi-seriia-kevlar-26949',
                ),
              },
              {
                label: 'На розетцi (R-08/R-10)',
                routerLink: catalogLink(
                  'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915',
                ),
              },
              {
                label: 'На розетцi (HRoz)',
                routerLink: catalogLink(
                  'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854',
                ),
              },
              {
                label: 'На розетцi (Genrich)',
                routerLink: catalogLink(
                  'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904',
                ),
              },
              {
                label: 'На розетцi (Ultara)',
                routerLink: catalogLink(
                  'kedr-ruchki-na-rozettsi-seriia-ultra-6982',
                ),
              },
              {
                label: 'З нержавiйки',
                routerLink: catalogLink('kedr-ruchki-z-nerzhaviiki-5999'),
              },
              {
                label: 'Ручки-кноби',
                routerLink: catalogLink('kedr-ruchki-knobi-6488'),
              },
            ],
          },
          {
            label: 'Циліндри',
            items: [
              {
                label: 'серії BRASS KEY Латунь',
                routerLink: catalogLink(
                  'kedr-tsilindri-seriyi-brass-key-latun-2680',
                ),
              },
              {
                label: 'серії SMART',
                routerLink: catalogLink('kedr-tsilindri-seriyi-smart-26929'),
              },
              {
                label: 'серії GWK',
                routerLink: catalogLink('kedr-tsilindri-seriyi-gwk-26930'),
              },
              {
                label: 'серії ZINK під шток',
                routerLink: catalogLink(
                  'kedr-tsilindri-seriyi-zink-pid-shtok-27124',
                ),
              },
              {
                label: 'серії ZINK',
                routerLink: catalogLink('kedr-tsilindri-seriyi-zink-5852'),
              },
              {
                label: 'серії ZINK PLK',
                routerLink: catalogLink('kedr-tsilindri-seriyi-zink-plk-4555'),
              },
              {
                label: 'серії ALU',
                routerLink: catalogLink('kedr-tsilindri-seriyi-alu-6560'),
              },
            ],
          },
        ],
        [
          {
            label: 'Міжкімнатні механізми',
            items: [
              {
                label: ' з магнітною защіпкою',
                routerLink: catalogLink(
                  'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197',
                ),
              },
              {
                label: 'заскочки / засувки',
                routerLink: catalogLink(
                  "kedr-mizhkimnatni-zaskochki-zasuvki-2321'",
                ),
              },
              {
                label: 'з металевою защіпкою',
                routerLink: catalogLink(
                  'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273',
                ),
              },
              {
                label: 'з кевларовою защіпкою',
                routerLink: catalogLink(
                  'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108',
                ),
              },
            ],
          },
          {
            label: 'Інше',
            items: [
              {
                label: 'Броненакладки на циліндр',
                routerLink: catalogLink(
                  'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230',
                ),
              },
              {
                label: 'Ущільнювач',
                routerLink: catalogLink('kedr-ushchilniuvach-1440'),
              },
              {
                label: 'Відбійники',
                routerLink: catalogLink('kedr-vidbiiniki-3783'),
              },
              {
                label: 'Комплектуючі',
                routerLink: catalogLink('kedr-komplektuiuchi-5625'),
              },
              {
                label: 'Засувки і шпінгалети',
                routerLink: catalogLink(
                  'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912',
                ),
              },
              {
                label: 'Розсувнi системи',
                routerLink: catalogLink('kedr-rozsuvni-sistemi-6295'),
              },
              {
                label: 'Дотягувачі',
                routerLink: catalogLink('kedr-dotiaguvachi-5962'),
              },
              {
                label: 'Вiчка двернi',
                routerLink: catalogLink('kedr-vichka-dverni-5957'),
              },
            ],
          },
        ],
        [
          {
            label: 'Вхідні двері',
            items: [
              {
                label: 'Steelguard',
                routerLink: catalogLink('dveri-steelguard-7258'),
              },
              {
                label: 'Lacosta',
                routerLink: catalogLink('dveri-lacosta-7259'),
              },
              { label: 'Sova', routerLink: catalogLink('dveri-sova-19425') },
              { label: 'MSM', routerLink: catalogLink('dveri-msm-27083') },
              { label: 'Maximum', routerLink: catalogLink('dveri-tsdkh-8209') },
            ],
          },
          {
            label: 'Міжкімнатні двері',
            items: [
              { label: 'Korfad', routerLink: catalogLink('m_korfad-8349') },
              { label: 'Leador', routerLink: catalogLink('m_leador-8344') },
              { label: 'Darumi', routerLink: catalogLink('m_darumi-19424') },
              {
                label: 'Syndicate',
                routerLink: catalogLink('dveri-sindikat-26971'),
              },
            ],
          },
        ],
      ],
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
              { label: 'Угода користувача' },
              { label: 'Політика конфіденційності' },
              { label: 'Юридична інформація' },
              { label: 'Договір публічної оферти' },
            ],
          },
        ],
        [
          {
            items: [
              {
                image:
                  'https://primefaces.org/cdn/primeng/images/uikit/uikit-system.png',
                label: 'Замовити оптом',
                routerLink: '/wholesale',
                subtext: 'Умови співпраці для оптових партнерів',
              },
            ],
          },
        ],
      ],
    },
  ];
}
