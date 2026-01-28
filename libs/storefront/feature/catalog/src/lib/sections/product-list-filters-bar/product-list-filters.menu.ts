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
              command: () => deps.goToCategory('zavisy-nakladni'),
            },
            {
              label: 'Ввертні та приварні',
            },
            {
              label: 'Врізні',
            },
          ],
        },
        {
          label: 'Замки',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Навестні та велозамки',
            },
            {
              label: 'Комплекти з ручками',
            },
            {
              label: 'Накладні',
            },
            {
              label: 'Сувальдні та з хрестообр. ключем',
            },
            {
              label: 'Врiзні під циліндр',
            },
          ],
        },
        {
          label: 'Ручки',
          icon: 'pi pi-image',
          items: [
            {
              label: 'На розетцi (Kevlar)',
            },
            {
              label: 'На розетцi (HRoz)',
            },
            {
              label: 'На розетцi (Genrich)',
            },
            {
              label: 'На розетцi (Ultara)',
            },
            {
              label: 'З нержавiйки',
            },
            {
              label: 'Ручки-кноби',
            },
          ],
        },
        {
          label: 'Циліндри',
          icon: 'pi pi-image',
          items: [
            {
              label: 'серія BRASS KEY Латунь',
            },
            {
              label: 'серія SMART',
            },
            {
              label: 'серія GWK',
            },
            {
              label: 'серія ZINK під шток',
            },
            {
              label: 'серія ZINK',
            },
            {
              label: 'серія ALU',
            },
          ],
        },
        {
          label: 'Міжкімнатні мханізми',
          icon: 'pi pi-image',
          items: [
            {
              label: 'з магнітною защіпкою',
            },
            {
              label: 'заскочки / засувки',
            },
            {
              label: 'з металевою защіпкою',
            },
            {
              label: 'з кевларовою защіпкою',
            },
            {
              label: 'TV Stand',
            },
          ],
        },
        {
          label: 'Інше',
          icon: 'pi pi-image',
          items: [
            {
              label: 'Броненакладки на циліндр',
            },
            {
              label: 'Ущільнювач',
            },
            {
              label: 'Відбійники',
            },
            {
              label: 'Комплектуючі',
            },
            {
              label: 'Засувки і шпінгалети',
            },
            {
              label: 'Розсувнi системи',
            },
            {
              label: 'Дотягувачі',
            },
            {
              label: 'Вiчка двернi',
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
          icon: 'pi pi-cloud-upload',
        },
        {
          label: 'Leador',
          icon: 'pi pi-cloud-download',
        },
        {
          label: 'Darumi',
          icon: 'pi pi-cloud-upload',
        },
        {
          label: 'Syndicate',
          icon: 'pi pi-cloud-download',
        },
      ],
    },
    {
      label: 'Вхідні двері',
      icon: 'pi pi-cloud',
      items: [
        {
          label: 'Steelguard',
          icon: 'pi pi-cloud-upload',
        },
        {
          label: 'Lacosta',
          icon: 'pi pi-cloud-download',
        },
        {
          label: 'Sova',
          icon: 'pi pi-cloud-upload',
        },
        {
          label: 'MSM',
          icon: 'pi pi-cloud-download',
        },
        {
          label: 'Maximum',
          icon: 'pi pi-cloud-upload',
        },
      ],
    },
  ];
}
