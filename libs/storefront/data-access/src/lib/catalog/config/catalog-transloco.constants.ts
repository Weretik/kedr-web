import {
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_CATEGORIES,
} from './catalog-category-slugs.constants';

export const CATALOG_ROOT_TRANSLATION_KEYS: Record<
  keyof typeof CATALOG_ROOT_CATEGORIES,
  string
> = {
  hardware: 'catalog.root.hardware',
  doors: 'catalog.root.doors',
};

export const CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS: Record<
  keyof typeof CATALOG_HARDWARE_SECTIONS,
  string
> = {
  hinges: 'catalog.section.hinges',
  locks: 'catalog.section.locks',
  handles: 'catalog.section.handles',
  cylinders: 'catalog.section.cylinders',
  interiorMechanisms: 'catalog.section.interiorMechanisms',
  other: 'catalog.section.other',
};

export const CATALOG_DOOR_SECTION_TRANSLATION_KEYS: Record<
  keyof typeof CATALOG_DOOR_SECTIONS,
  string
> = {
  entranceDoors: 'catalog.section.entranceDoors',
  interiorDoors: 'catalog.section.interiorDoors',
};

export const CATALOG_ITEM_TRANSLATION_KEYS_BY_SLUG: Record<string, string> = {
  'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707':
    'catalog.item.hinges.butterfly',
  'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457':
    'catalog.item.hinges.welded',
  'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139':
    'catalog.item.hinges.mortise',
  'kedr-zamki-navisni-ta-velozamki-1304': 'catalog.item.locks.padlocks',
  'kedr-komplekti-zamki-z-ruchkami-2716': 'catalog.item.locks.sets',
  'kedr-zamki-nakladni-2722': 'catalog.item.locks.rim',
  'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775':
    'catalog.item.locks.lever',
  'kedr-zamki-vrizni-pid-tsilindr-5851': 'catalog.item.locks.cylinder',
  'kedr-ruchki-na-rozettsi-seriia-kevlar-26949': 'catalog.item.handles.kevlar',
  'kedr-ruchki-na-plantsi-5853': 'catalog.item.handles.plate',
  'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915':
    'catalog.item.handles.standard',
  'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854':
    'catalog.item.handles.econom',
  'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904':
    'catalog.item.handles.premium',
  'kedr-ruchki-na-rozettsi-seriia-ultra-6982': 'catalog.item.handles.ultra',
  'kedr-ruchki-z-nerzhaviiki-5999': 'catalog.item.handles.stainless',
  'kedr-ruchki-knobi-6488': 'catalog.item.handles.knobs',
  'kedr-tsilindri-seriyi-brass-key-latun-2680': 'catalog.item.cylinders.brass',
  'kedr-tsilindri-seriyi-smart-26929': 'catalog.item.cylinders.smart',
  'kedr-tsilindri-seriyi-gwk-26930': 'catalog.item.cylinders.gwk',
  'kedr-tsilindri-seriyi-zink-pid-shtok-27124':
    'catalog.item.cylinders.zinkStem',
  'kedr-tsilindri-seriyi-zink-5852': 'catalog.item.cylinders.zink',
  'kedr-tsilindri-seriyi-zink-plk-4555': 'catalog.item.cylinders.zinkPlk',
  'kedr-tsilindri-seriyi-alu-6560': 'catalog.item.cylinders.alu',
  'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197':
    'catalog.item.mechanisms.magnetic',
  'kedr-mizhkimnatni-zaskochki-zasuvki-2321': 'catalog.item.mechanisms.latches',
  'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273':
    'catalog.item.mechanisms.metal',
  'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108':
    'catalog.item.mechanisms.kevlar',
  'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230':
    'catalog.item.other.armor',
  'kedr-ushchilniuvach-1440': 'catalog.item.other.seal',
  'kedr-vidbiiniki-3783': 'catalog.item.other.stoppers',
  'kedr-komplektuiuchi-5625': 'catalog.item.other.components',
  'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912':
    'catalog.item.other.bolts',
  'kedr-rozsuvni-sistemi-6295': 'catalog.item.other.sliding',
  'kedr-dotiaguvachi-5962': 'catalog.item.other.closers',
  'kedr-vichka-dverni-5957': 'catalog.item.other.eye',
};
