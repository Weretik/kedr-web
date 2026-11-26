import type { ContentLanguage } from './category-content';

export interface AdminCategory {
  id: number;
  /** Ukrainian short name, the label staff see. */
  nameUk: string;
  nameRu: string;
  /** Original 1C name. */
  sourceName: string;
  slug: string;
  sourceKey: string;
  parentId: number | null;
  sortOrder: number;
  level: number;
  isDeleted: boolean;
  deletedAt: string | null;
  /** Shown on the site, in «Вітрина сайту», and in «Моделі»; an Admin changes it. */
  isShownOnSite: boolean;
  /** Active products here and in descendants; `null` when the server did not count them. */
  productCount: number | null;
  /** Languages with any site text; `null` when unknown (deleted rows, single reads). */
  filledLanguages: readonly ContentLanguage[] | null;
  /** Names an editor wrote for the site; they win over 1C. `null` when not written. */
  siteNameUk: string | null;
  siteNameRu: string | null;
  /** «Закрити від пошуку»: the site keeps the page but search engines do not index it or its products. */
  isClosedFromSearch: boolean;
  /** Made by hand in the admin, not by 1C: only such a category can be deleted (spec 002 R-002, R-004). */
  isManual: boolean;
  /** Link-preview picture of the category page; `url` is `null` in lists or when the file left the library. */
  sharePicture: CategorySharePicture | null;
  /** Site models here and in descendants; `null` outside the active list (spec 003 R-001). */
  modelCount: number | null;
  /** Of them, models nobody accepted yet («Не перевірена»); `null` outside the active list. */
  proposedModelCount: number | null;
}

export interface CategorySharePicture {
  mediaFileId: number;
  url: string | null;
}

/** The name the site shows: the admin site name, else the 1C short name (spec 003 R-001). */
export function siteNameOf(category: AdminCategory, language: ContentLanguage = 'uk'): string {
  return language === 'uk'
    ? (category.siteNameUk ?? category.nameUk)
    : (category.siteNameRu ?? category.nameRu);
}

/** Languages without any site text, or `null` when the list did not say. */
export function missingContentLanguages(category: AdminCategory): ContentLanguage[] | null {
  if (category.filledLanguages === null) return null;
  return (['uk', 'ru'] as const).filter(
    (language) => !category.filledLanguages?.includes(language),
  );
}

/** A site model placed in a category, for «Моделі на сайті» (spec 002 R-006). */
export interface CategorySiteModel {
  id: number;
  name: string;
  /** A proposal is «Не перевірена». */
  isProposed: boolean;
  productCount: number;
  /** The model's current site category, shown when picking a model from elsewhere. */
  categoryName: string;
}
