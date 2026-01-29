import type { MenuItem } from 'primeng/api';

export function buildFiltersMenu(deps: {
  goToCategory: (slug: string) => void;
}): MenuItem[] {
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
              command: () =>
                deps.goToCategory(
                  'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707',
                ),
            },
            {
              label: 'Ввертні та приварні',
              command: () =>
                deps.goToCategory(
                  'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457',
                ),
            },
            {
              label: 'Врізні',
              command: () =>
                deps.goToCategory(
                  'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139',
                ),
            },
          ],
        },
        {
          label: 'Замки',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Навестні та велозамки',
              command: () =>
                deps.goToCategory('kedr-zamki-navisni-ta-velozamki-1304'),
            },
            {
              label: 'Комплекти з ручками',
              command: () =>
                deps.goToCategory('kedr-komplekti-zamki-z-ruchkami-2716'),
            },
            {
              label: 'Накладні',
              command: () => deps.goToCategory('kedr-zamki-nakladni-2722'),
            },
            {
              label: 'Сувальдні та з хрестообр. ключем',
              command: () =>
                deps.goToCategory(
                  'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775',
                ),
            },
            {
              label: 'Врiзні під циліндр',
              command: () =>
                deps.goToCategory('kedr-zamki-vrizni-pid-tsilindr-5851'),
            },
          ],
        },
        {
          label: 'Ручки',
          icon: 'pi pi-image',
          items: [
            {
              label: 'На розетцi (Kevlar)',
              command: () =>
                deps.goToCategory(
                  'kedr-ruchki-na-rozettsi-seriia-kevlar-26949',
                ),
            },
            {
              label: 'На планці',
              command: () => deps.goToCategory('kedr-ruchki-na-plantsi-5853'),
            },
            {
              label: 'На розетцi (R-08/R-10)',
              command: () =>
                deps.goToCategory(
                  'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915',
                ),
            },
            {
              label: 'На розетцi (HRoz)',
              command: () =>
                deps.goToCategory(
                  'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854',
                ),
            },
            {
              label: 'На розетцi (Genrich)',
              command: () =>
                deps.goToCategory(
                  'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904',
                ),
            },
            {
              label: 'На розетцi (Ultara)',
              command: () =>
                deps.goToCategory('kedr-ruchki-na-rozettsi-seriia-ultra-6982'),
            },
            {
              label: 'З нержавiйки',
              command: () =>
                deps.goToCategory('kedr-ruchki-z-nerzhaviiki-5999'),
            },
            {
              label: 'Ручки-кноби',
              command: () => deps.goToCategory('kedr-ruchki-knobi-6488'),
            },
          ],
        },
        {
          label: 'Циліндри',
          icon: 'pi pi-image',
          items: [
            {
              label: 'серія BRASS KEY Латунь',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-brass-key-latun-2680'),
            },
            {
              label: 'серія SMART',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-smart-26929'),
            },
            {
              label: 'серія GWK',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-gwk-26930'),
            },
            {
              label: 'серія ZINK під шток',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-zink-pid-shtok-27124'),
            },
            {
              label: 'серія ZINK',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-zink-5852'),
            },
            {
              label: 'серія ZINK PLK',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-zink-plk-4555'),
            },
            {
              label: 'серія ALU',
              command: () =>
                deps.goToCategory('kedr-tsilindri-seriyi-alu-6560'),
            },
          ],
        },
        {
          label: 'Міжкімнатні мханізми',
          icon: 'pi pi-image',
          items: [
            {
              label: 'з магнітною защіпкою',
              command: () =>
                deps.goToCategory(
                  'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197',
                ),
            },
            {
              label: 'заскочки / засувки',
              command: () =>
                deps.goToCategory('kedr-mizhkimnatni-zaskochki-zasuvki-2321'),
            },
            {
              label: 'з металевою защіпкою',
              command: () =>
                deps.goToCategory(
                  'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273',
                ),
            },
            {
              label: 'з кевларовою защіпкою',
              command: () =>
                deps.goToCategory(
                  'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108',
                ),
            },
          ],
        },
        {
          label: 'Інше',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Броненакладки на циліндр',
              command: () =>
                deps.goToCategory(
                  'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230',
                ),
            },
            {
              label: 'Ущільнювач',
              command: () => deps.goToCategory('kedr-ushchilniuvach-1440'),
            },
            {
              label: 'Відбійники',
              command: () => deps.goToCategory('kedr-vidbiiniki-3783'),
            },
            {
              label: 'Комплектуючі',
              command: () => deps.goToCategory('kedr-komplektuiuchi-5625'),
            },
            {
              label: 'Засувки і шпінгалети',
              command: () =>
                deps.goToCategory(
                  'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912',
                ),
            },
            {
              label: 'Розсувнi системи',
              command: () => deps.goToCategory('kedr-rozsuvni-sistemi-6295'),
            },
            {
              label: 'Дотягувачі',
              command: () => deps.goToCategory('kedr-dotiaguvachi-5962'),
            },
            {
              label: 'Вiчка двернi',
              command: () => deps.goToCategory('kedr-vichka-dverni-5957'),
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
          command: () => deps.goToCategory('m_korfad-8349'),
        },
        {
          label: 'Leador',
          command: () => deps.goToCategory('m_leador-8344'),
        },
        {
          label: 'Darumi',
          command: () => deps.goToCategory('m_darumi-19424'),
        },
        {
          label: 'Syndicate',
          command: () => deps.goToCategory('dveri-sindikat-26971'),
        },
      ],
    },
    {
      label: 'Вхідні двері',
      icon: 'pi pi-cloud',
      items: [
        {
          label: 'Steelguard',
          command: () => deps.goToCategory('dveri-steelguard-7258'),
        },
        {
          label: 'Lacosta',
          command: () => deps.goToCategory('dveri-lacosta-7259'),
        },
        {
          label: 'Sova',
          command: () => deps.goToCategory('dveri-sova-19425'),
        },
        {
          label: 'MSM',
          command: () => deps.goToCategory('dveri-msm-27083'),
        },
        {
          label: 'Maximum',
          command: () => deps.goToCategory('dveri-tsdkh-8209'),
        },
      ],
    },
  ];
}
