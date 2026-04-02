import {
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_CATEGORIES,
} from './catalog-category-slugs.constants';

declare const $localize: (
  messageParts: TemplateStringsArray,
  ...expressions: readonly unknown[]
) => string;

const ROOT_LABELS: Record<keyof typeof CATALOG_ROOT_CATEGORIES, string> = {
  hardware: $localize`:@@catalog.root.hardware:Фурнітура`,
  doors: $localize`:@@catalog.root.doors:Двері`,
};

const HARDWARE_SECTION_LABELS: Record<
  keyof typeof CATALOG_HARDWARE_SECTIONS,
  string
> = {
  hinges: $localize`:@@catalog.section.hinges:Завіси`,
  locks: $localize`:@@catalog.section.locks:Замки`,
  handles: $localize`:@@catalog.section.handles:Ручки`,
  cylinders: $localize`:@@catalog.section.cylinders:Циліндри`,
  interiorMechanisms: $localize`:@@catalog.section.interiorMechanisms:Міжкімнатні механізми`,
  other: $localize`:@@catalog.section.other:Інше`,
};

const DOOR_SECTION_LABELS: Record<keyof typeof CATALOG_DOOR_SECTIONS, string> =
  {
    entranceDoors: $localize`:@@catalog.section.entranceDoors:Вхідні двері`,
    interiorDoors: $localize`:@@catalog.section.interiorDoors:Міжкімнатні двері`,
  };

const ITEM_LABELS_BY_SLUG: Record<string, string> = {
  'kedr-zavisi-nakladni-meteliki-dlia-mizhkimnatnikh-dverei-1707': $localize`:@@catalog.item.hinges.butterfly:Накладні (метелик)`,
  'kedr-zavisi-vvertni-ta-kovpachki-do-nikh-privarni-zavisi-4457': $localize`:@@catalog.item.hinges.welded:Ввертні та приварні`,
  'kedr-zavisi-vrizni-dlia-mizhkimnatnikh-dverei-6139': $localize`:@@catalog.item.hinges.mortise:Врізні`,
  'kedr-zamki-navisni-ta-velozamki-1304': $localize`:@@catalog.item.locks.padlocks:Навісні та велозамки`,
  'kedr-komplekti-zamki-z-ruchkami-2716': $localize`:@@catalog.item.locks.sets:Комплекти з ручками`,
  'kedr-zamki-nakladni-2722': $localize`:@@catalog.item.locks.rim:Накладні`,
  'kedr-zamki-suvaldni-ta-z-khrestoobr.-kliuchem-2775': $localize`:@@catalog.item.locks.lever:Сувальдні та з хрестоподібним ключем`,
  'kedr-zamki-vrizni-pid-tsilindr-5851': $localize`:@@catalog.item.locks.cylinder:Врізні під циліндр`,
  'kedr-ruchki-na-rozettsi-seriia-kevlar-26949': $localize`:@@catalog.item.handles.kevlar:На розетці (Kevlar)`,
  'kedr-ruchki-na-plantsi-5853': $localize`:@@catalog.item.handles.plate:На планці`,
  'kedr-ruchki-na-rozettsi-seriia-standart-r-08-r-10-5915': $localize`:@@catalog.item.handles.standard:На розетці (R-08/R-10)`,
  'kedr-ruchki-na-rozettsi-seriia-ekonom-hroz-06-hroz-07-5854': $localize`:@@catalog.item.handles.econom:На розетці (HRoz-06/HRoz-07)`,
  'kedr-ruchki-na-rozettsi-seriia-premium-genrich-5904': $localize`:@@catalog.item.handles.premium:На розетці преміум (Genrich)`,
  'kedr-ruchki-na-rozettsi-seriia-ultra-6982': $localize`:@@catalog.item.handles.ultra:На розетці (Ultra)`,
  'kedr-ruchki-z-nerzhaviiki-5999': $localize`:@@catalog.item.handles.stainless:З нержавійки`,
  'kedr-ruchki-knobi-6488': $localize`:@@catalog.item.handles.knobs:Ручки-кноби`,
  'kedr-tsilindri-seriyi-brass-key-latun-2680': $localize`:@@catalog.item.cylinders.brass:Серії BRASS KEY Латунь`,
  'kedr-tsilindri-seriyi-smart-26929': $localize`:@@catalog.item.cylinders.smart:Серії SMART`,
  'kedr-tsilindri-seriyi-gwk-26930': $localize`:@@catalog.item.cylinders.gwk:Серії GWK`,
  'kedr-tsilindri-seriyi-zink-pid-shtok-27124': $localize`:@@catalog.item.cylinders.zinkStem:Серії ZINK під шток`,
  'kedr-tsilindri-seriyi-zink-5852': $localize`:@@catalog.item.cylinders.zink:Серії ZINK`,
  'kedr-tsilindri-seriyi-zink-plk-4555': $localize`:@@catalog.item.cylinders.zinkPlk:Серії ZINK PLK`,
  'kedr-tsilindri-seriyi-alu-6560': $localize`:@@catalog.item.cylinders.alu:Серії ALU`,
  'kedr-mizhkimnatni-mekhanizmi-z-magnitnoiu-zashchipkoiu-2197': $localize`:@@catalog.item.mechanisms.magnetic:З магнітною защіпкою`,
  'kedr-mizhkimnatni-zaskochki-zasuvki-2321': $localize`:@@catalog.item.mechanisms.latches:Заскочки / засувки`,
  'kedr-mizhkimnatni-mekhanizmi-z-metalevoiu-zashchipkoiu-5273': $localize`:@@catalog.item.mechanisms.metal:З металевою защіпкою`,
  'kedr-mizhkimnatni-mekhanizmi-z-kevlarovoiu-zashchipkoiu-6108': $localize`:@@catalog.item.mechanisms.kevlar:З кевларовою защіпкою`,
  'kedr-bronenakladki-na-tsilindr-ta-nakladki-na-suvaldni-zamki-1230': $localize`:@@catalog.item.other.armor:Броненакладки на циліндр`,
  'kedr-ushchilniuvach-1440': $localize`:@@catalog.item.other.seal:Ущільнювач`,
  'kedr-vidbiiniki-3783': $localize`:@@catalog.item.other.stoppers:Відбійники`,
  'kedr-komplektuiuchi-5625': $localize`:@@catalog.item.other.components:Комплектуючі`,
  'kedr-zasuvki-i-shpingaleti-dlia-vkhidnikh-ta-mizhkimnatnikh-dverei-5912': $localize`:@@catalog.item.other.bolts:Засувки і шпінгалети`,
  'kedr-rozsuvni-sistemi-6295': $localize`:@@catalog.item.other.sliding:Розсувні системи`,
  'kedr-dotiaguvachi-5962': $localize`:@@catalog.item.other.closers:Дотягувачі`,
  'kedr-vichka-dverni-5957': $localize`:@@catalog.item.other.eye:Вічка дверні`,
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
