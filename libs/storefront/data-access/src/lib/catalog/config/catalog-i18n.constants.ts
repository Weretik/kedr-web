import {
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_CATEGORIES,
} from './catalog-category-slugs.constants';

const ROOT_LABELS: Record<keyof typeof CATALOG_ROOT_CATEGORIES, string> = {
  hardware: 'Фурнітура',
  doors: 'Двері',
};

const HARDWARE_SECTION_LABELS: Record<
  keyof typeof CATALOG_HARDWARE_SECTIONS,
  string
> = {
  hinges: 'Завіси',
  locks: 'Замки',
  handles: 'Ручки',
  cylinders: 'Циліндри',
  interiorMechanisms: 'Міжкімнатні механізми',
  other: 'Інше',
};

const DOOR_SECTION_LABELS: Record<keyof typeof CATALOG_DOOR_SECTIONS, string> =
  {
    entranceDoors: 'Вхідні двері',
    interiorDoors: 'Міжкімнатні двері',
  };

const ITEM_LABELS_BY_SLUG: Record<string, string> = {
  'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707':
    'Накладні (метелик)',
  'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457':
    'Ввертні та приварні',
  'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139': 'Врізні',
  'kedr-zamki-navisni-ta-velozamki-1304': 'Навісні та велозамки',
  'kedr-komplekti-zamki-z-ruchkami-2716': 'Комплекти з ручками',
  'kedr-zamki-nakladni-2722': 'Накладні',
  'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775':
    'Сувальдні та з хрестоподібним ключем',
  'kedr-zamki-vrizni-pid-tsilindr-5851': 'Врізні під циліндр',
  'kedr-ruchki-na-rozettsi-seriia-kevlar-26949': 'На розетці (Kevlar)',
  'kedr-ruchki-na-plantsi-5853': 'На планці',
  'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915':
    'На розетці (R-08/R-10)',
  'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854':
    'На розетці (HRoz-06/HRoz-07)',
  'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904':
    'На розетці преміум (Genrich)',
  'kedr-ruchki-na-rozettsi-seriia-ultra-6982': 'На розетці (Ultra)',
  'kedr-ruchki-z-nerzhaviiki-5999': 'З нержавійки',
  'kedr-ruchki-knobi-6488': 'Ручки-кноби',
  'kedr-tsilindri-seriyi-brass-key-latun-2680': 'Серії BRASS KEY Латунь',
  'kedr-tsilindri-seriyi-smart-26929': 'Серії SMART',
  'kedr-tsilindri-seriyi-gwk-26930': 'Серії GWK',
  'kedr-tsilindri-seriyi-zink-pid-shtok-27124': 'Серії ZINK під шток',
  'kedr-tsilindri-seriyi-zink-5852': 'Серії ZINK',
  'kedr-tsilindri-seriyi-zink-plk-4555': 'Серії ZINK PLK',
  'kedr-tsilindri-seriyi-alu-6560': 'Серії ALU',
  'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197':
    'З магнітною защіпкою',
  'kedr-mizhkimnatni-zaskochki-zasuvki-2321': 'Заскочки / засувки',
  'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273':
    'З металевою защіпкою',
  'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108':
    'З кевларовою защіпкою',
  'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230':
    'Броненакладки на циліндр',
  'kedr-ushchilniuvach-1440': 'Ущільнювач',
  'kedr-vidbiiniki-3783': 'Відбійники',
  'kedr-komplektuiuchi-5625': 'Комплектуючі',
  'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912':
    'Засувки і шпінгалети',
  'kedr-rozsuvni-sistemi-6295': 'Розсувні системи',
  'kedr-dotiaguvachi-5962': 'Дотягувачі',
  'kedr-vichka-dverni-5957': 'Вічка дверні',
};

export function getCatalogRootLabel(
  key: keyof typeof CATALOG_ROOT_CATEGORIES,
): string {
  return ROOT_LABELS[key];
}

export function getCatalogHardwareSectionLabel(
  key: keyof typeof CATALOG_HARDWARE_SECTIONS,
): string {
  return HARDWARE_SECTION_LABELS[key];
}

export function getCatalogDoorSectionLabel(
  key: keyof typeof CATALOG_DOOR_SECTIONS,
): string {
  return DOOR_SECTION_LABELS[key];
}

export function getCatalogItemLabel(
  slug: string,
  fallbackLabel: string,
): string {
  return ITEM_LABELS_BY_SLUG[slug] ?? fallbackLabel;
}
