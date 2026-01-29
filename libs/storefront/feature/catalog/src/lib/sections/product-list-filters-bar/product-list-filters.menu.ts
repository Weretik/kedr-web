import type { MenuItem } from 'primeng/api';

export function buildFiltersMenu(): MenuItem[] {
  return [
    {
      label: 'Фурнітура',
      icon: 'pi pi-file',
      items: [
        {
          label: 'Завіси',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Накладні(метелик)',
              routerLink: [
                '/catalog',
                'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707',
                'products',
              ],
            },
            {
              label: 'Ввертні та приварні',
              routerLink: [
                '/catalog',
                'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457',
                'products',
              ],
            },
            {
              label: 'Врізні',
              routerLink: [
                '/catalog',
                'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139',
                'products',
              ],
            },
          ],
        },
        {
          label: 'Замки',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Навестні та велозамки',
              routerLink: [
                '/catalog',
                'kedr-zamki-navisni-ta-velozamki-1304',
                'products',
              ],
            },
            {
              label: 'Комплекти з ручками',
              routerLink: [
                '/catalog',
                'kedr-komplekti-zamki-z-ruchkami-2716',
                'products',
              ],
            },
            {
              label: 'Накладні',
              routerLink: ['/catalog', 'kedr-zamki-nakladni-2722', 'products'],
            },
            {
              label: 'Сувальдні та з хрестообр. ключем',
              routerLink: [
                '/catalog',
                'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775',
                'products',
              ],
            },
            {
              label: 'Врiзні під циліндр',
              routerLink: [
                '/catalog',
                'kedr-zamki-vrizni-pid-tsilindr-5851',
                'products',
              ],
            },
          ],
        },
        {
          label: 'Ручки',
          icon: 'pi pi-image',
          items: [
            {
              label: 'На розетцi (Kevlar)',
              routerLink: [
                '/catalog',
                'kedr-ruchki-na-rozettsi-seriia-kevlar-26949',
                'products',
              ],
            },
            {
              label: 'На планці',
              routerLink: [
                '/catalog',
                'kedr-ruchki-na-plantsi-5853',
                'products',
              ],
            },
            {
              label: 'На розетцi (R-08/R-10)',
              routerLink: [
                '/catalog',
                'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915',
                'products',
              ],
            },
            {
              label: 'На розетцi (HRoz)',
              routerLink: [
                '/catalog',
                'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854',
                'products',
              ],
            },
            {
              label: 'На розетцi (Genrich)',
              routerLink: [
                '/catalog',
                'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904',
                'products',
              ],
            },
            {
              label: 'На розетцi (Ultara)',
              routerLink: [
                '/catalog',
                'kedr-ruchki-na-rozettsi-seriia-ultra-6982',
                'products',
              ],
            },
            {
              label: 'З нержавiйки',
              routerLink: [
                '/catalog',
                'kedr-ruchki-z-nerzhaviiki-5999',
                'products',
              ],
            },
            {
              label: 'Ручки-кноби',
              routerLink: ['/catalog', 'kedr-ruchki-knobi-6488', 'products'],
            },
          ],
        },
        {
          label: 'Циліндри',
          icon: 'pi pi-image',
          items: [
            {
              label: 'серія BRASS KEY Латунь',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-brass-key-latun-2680',
                'products',
              ],
            },
            {
              label: 'серія SMART',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-smart-26929',
                'products',
              ],
            },
            {
              label: 'серія GWK',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-gwk-26930',
                'products',
              ],
            },
            {
              label: 'серія ZINK під шток',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-zink-pid-shtok-27124',
                'products',
              ],
            },
            {
              label: 'серія ZINK',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-zink-5852',
                'products',
              ],
            },
            {
              label: 'серія ZINK PLK',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-zink-plk-4555',
                'products',
              ],
            },
            {
              label: 'серія ALU',
              routerLink: [
                '/catalog',
                'kedr-tsilindri-seriyi-alu-6560',
                'products',
              ],
            },
          ],
        },
        {
          label: 'Міжкімнатні мханізми',
          icon: 'pi pi-image',
          items: [
            {
              label: 'з магнітною защіпкою',
              routerLink: [
                '/catalog',
                'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197',
                'products',
              ],
            },
            {
              label: 'заскочки / засувки',
              routerLink: [
                '/catalog',
                'kedr-mizhkimnatni-zaskochki-zasuvki-2321',
                'products',
              ],
            },
            {
              label: 'з металевою защіпкою',
              routerLink: [
                '/catalog',
                'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273',
                'products',
              ],
            },
            {
              label: 'з кевларовою защіпкою',
              routerLink: [
                '/catalog',
                'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108',
                'products',
              ],
            },
          ],
        },
        {
          label: 'Інше',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Броненакладки на циліндр',
              routerLink: [
                '/catalog',
                'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230',
                'products',
              ],
            },
            {
              label: 'Ущільнювач',
              routerLink: ['/catalog', 'kedr-ushchilniuvach-1440', 'products'],
            },
            {
              label: 'Відбійники',
              routerLink: ['/catalog', 'kedr-vidbiiniki-3783', 'products'],
            },
            {
              label: 'Комплектуючі',
              routerLink: ['/catalog', 'kedr-komplektuiuchi-5625', 'products'],
            },
            {
              label: 'Засувки і шпінгалети',
              routerLink: [
                '/catalog',
                'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912',
                'products',
              ],
            },
            {
              label: 'Розсувнi системи',
              routerLink: [
                '/catalog',
                'kedr-rozsuvni-sistemi-6295',
                'products',
              ],
            },
            {
              label: 'Дотягувачі',
              routerLink: ['/catalog', 'kedr-dotiaguvachi-5962', 'products'],
            },
            {
              label: 'Вiчка двернi',
              routerLink: ['/catalog', 'kedr-vichka-dverni-5957', 'products'],
            },
          ],
        },
      ],
    },
    {
      label: 'Міжкімнатні двері',
      icon: 'pi pi-cloud',
      items: [
        {
          label: 'Korfad',
          routerLink: ['/catalog', 'm_korfad-8349', 'products'],
        },
        {
          label: 'Leador',
          routerLink: ['/catalog', 'm_leador-8344', 'products'],
        },
        {
          label: 'Darumi',
          routerLink: ['/catalog', 'm_darumi-19424', 'products'],
        },
        {
          label: 'Syndicate',
          routerLink: ['/catalog', 'dveri-sindikat-26971', 'products'],
        },
      ],
    },
    {
      label: 'Вхідні двері',
      icon: 'pi pi-cloud',
      items: [
        {
          label: 'Steelguard',
          routerLink: ['/catalog', 'dveri-steelguard-7258', 'products'],
        },
        {
          label: 'Lacosta',
          routerLink: ['/catalog', 'dveri-lacosta-7259', 'products'],
        },
        {
          label: 'Sova',
          routerLink: ['/catalog', 'dveri-sova-19425', 'products'],
        },
        {
          label: 'MSM',
          routerLink: ['/catalog', 'dveri-msm-27083', 'products'],
        },
        {
          label: 'Maximum',
          routerLink: ['/catalog', 'dveri-tsdkh-8209', 'products'],
        },
      ],
    },
  ];
}
