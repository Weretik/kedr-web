import type { MenuItem } from 'primeng/api';

const FILTERS_MENU_STRUCTURE: (MenuItem & { categorySlug?: string })[] = [
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
            categorySlug:
              'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707',
          },
          {
            label: 'Ввертні та приварні',
            categorySlug:
              'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457',
          },
          {
            label: 'Врізні',
            categorySlug: 'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139',
          },
        ],
      },
      {
        label: 'Замки',
        icon: 'pi pi-image',
        items: [
          {
            label: 'Навестні та велозамки',
            categorySlug: 'kedr-zamki-navisni-ta-velozamki-1304',
          },
          {
            label: 'Комплекти з ручками',
            categorySlug: 'kedr-komplekti-zamki-z-ruchkami-2716',
          },
          {
            label: 'Накладні',
            categorySlug: 'kedr-zamki-nakladni-2722',
          },
          {
            label: 'Сувальдні та з хрестообр. ключем',
            categorySlug: 'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775',
          },
          {
            label: 'Врiзні под циліндр',
            categorySlug: 'kedr-zamki-vrizni-pid-tsilindr-5851',
          },
        ],
      },
      {
        label: 'Ручки',
        icon: 'pi pi-image',
        items: [
          {
            label: 'На розетцi (Kevlar)',
            categorySlug: 'kedr-ruchki-na-rozettsi-seriia-kevlar-26949',
          },
          {
            label: 'На планці',
            categorySlug: 'kedr-ruchki-na-plantsi-5853',
          },
          {
            label: 'На розетцi (R-08/R-10)',
            categorySlug:
              'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915',
          },
          {
            label: 'На розетцi (HRoz)',
            categorySlug:
              'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854',
          },
          {
            label: 'На розетцi (Genrich)',
            categorySlug: 'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904',
          },
          {
            label: 'На розетцi (Ultara)',
            categorySlug: 'kedr-ruchki-na-rozettsi-seriia-ultra-6982',
          },
          {
            label: 'З нержавiйки',
            categorySlug: 'kedr-ruchki-z-nerzhaviiki-5999',
          },
          {
            label: 'Ручки-кноби',
            categorySlug: 'kedr-ruchki-knobi-6488',
          },
        ],
      },
      {
        label: 'Циліндри',
        icon: 'pi pi-image',
        items: [
          {
            label: 'серія BRASS KEY Латунь',
            categorySlug: 'kedr-tsilindri-seriyi-brass-key-latun-2680',
          },
          {
            label: 'серія SMART',
            categorySlug: 'kedr-tsilindri-seriyi-smart-26929',
          },
          {
            label: 'серія GWK',
            categorySlug: 'kedr-tsilindri-seriyi-gwk-26930',
          },
          {
            label: 'серія ZINK під шток',
            categorySlug: 'kedr-tsilindri-seriyi-zink-pid-shtok-27124',
          },
          {
            label: 'серія ZINK',
            categorySlug: 'kedr-tsilindri-seriyi-zink-5852',
          },
          {
            label: 'серія ZINK PLK',
            categorySlug: 'kedr-tsilindri-seriyi-zink-plk-4555',
          },
          {
            label: 'серія ALU',
            categorySlug: 'kedr-tsilindri-seriyi-alu-6560',
          },
        ],
      },
      {
        label: 'Міжкімнатні мханізми',
        icon: 'pi pi-image',
        items: [
          {
            label: 'з магнітною защіпкою',
            categorySlug:
              'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197',
          },
          {
            label: 'заскочки / засувки',
            categorySlug: 'kedr-mizhkimnatni-zaskochki-zasuvki-2321',
          },
          {
            label: 'з металевою защіпкою',
            categorySlug:
              'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273',
          },
          {
            label: 'з кевларовою защіпкою',
            categorySlug:
              'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108',
          },
        ],
      },
      {
        label: 'Інше',
        icon: 'pi pi-image',
        items: [
          {
            label: 'Броненакладки на циліндр',
            categorySlug:
              'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230',
          },
          {
            label: 'Ущільнювач',
            categorySlug: 'kedr-ushchilniuvach-1440',
          },
          {
            label: 'Відбійники',
            categorySlug: 'kedr-vidbiiniki-3783',
          },
          {
            label: 'Комплектуючі',
            categorySlug: 'kedr-komplektuiuchi-5625',
          },
          {
            label: 'Засувки і шпінгалети',
            categorySlug:
              'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912',
          },
          {
            label: 'Розсувнi системи',
            categorySlug: 'kedr-rozsuvni-sistemi-6295',
          },
          {
            label: 'Дотягувачі',
            categorySlug: 'kedr-dotiaguvachi-5962',
          },
          {
            label: 'Вiчка двернi',
            categorySlug: 'kedr-vichka-dverni-5957',
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
        categorySlug: 'm_korfad-8349',
      },
      {
        label: 'Leador',
        categorySlug: 'm_leador-8344',
      },
      {
        label: 'Darumi',
        categorySlug: 'm_darumi-19424',
      },
      {
        label: 'Syndicate',
        categorySlug: 'dveri-sindikat-26971',
      },
    ],
  },
  {
    label: 'Вхідні двері',
    icon: 'pi pi-cloud',
    items: [
      {
        label: 'Steelguard',
        categorySlug: 'dveri-steelguard-7258',
      },
      {
        label: 'Lacosta',
        categorySlug: 'dveri-lacosta-7259',
      },
      {
        label: 'Sova',
        categorySlug: 'dveri-sova-19425',
      },
      {
        label: 'MSM',
        categorySlug: 'dveri-msm-27083',
      },
      {
        label: 'Maximum',
        categorySlug: 'dveri-tsdkh-8209',
      },
    ],
  },
];

const applyCommand = (
  items: (MenuItem & { categorySlug?: string })[],
  actions: { goToCategory: (slug: string) => void },
  activeCategorySlug: string | null,
): (MenuItem & { categorySlug?: string; expanded?: boolean })[] => {
  return items.map((item) => {
    const newItem = { ...item };
    if (newItem.categorySlug && !newItem.command) {
      const slug = newItem.categorySlug;
      newItem.command = () => actions.goToCategory(slug);
    }

    if (newItem.items) {
      newItem.items = applyCommand(
        newItem.items as (MenuItem & { categorySlug?: string })[],
        actions,
        activeCategorySlug,
      );

      // Expand if any child is the active category or if a child is expanded
      const hasActiveChild = (
        newItem.items as (MenuItem & {
          categorySlug?: string;
          expanded?: boolean;
        })[]
      ).some(
        (child) => child.categorySlug === activeCategorySlug || child.expanded,
      );

      if (hasActiveChild) {
        newItem.expanded = true;
      }
    }

    return newItem;
  });
};

export function buildFiltersMenu(
  actions: {
    goToCategory: (slug: string) => void;
  },
  activeCategorySlug: string | null = null,
): (MenuItem & { categorySlug?: string })[] {
  return applyCommand(FILTERS_MENU_STRUCTURE, actions, activeCategorySlug);
}

export function findCategoryLabel(
  slug: string | null,
  items: (MenuItem & { categorySlug?: string })[] = FILTERS_MENU_STRUCTURE,
  parentLabels: string[] = [],
): string | null {
  if (!slug) return null;

  for (const item of items) {
    if (item.categorySlug === slug) {
      const labels = [...parentLabels];
      if (item.label) {
        labels.push(item.label);
      }
      return labels.join(': ');
    }
    if (item.items) {
      const currentLabels = item.label
        ? [...parentLabels, item.label]
        : parentLabels;
      const found = findCategoryLabel(
        slug,
        item.items as (MenuItem & { categorySlug?: string })[],
        currentLabels,
      );
      if (found) return found;
    }
  }
  return null;
}
