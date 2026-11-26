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
  /** Link-preview picture of the category page; `url` is `null` in lists or when the file left the library. */
  sharePicture: CategorySharePicture | null;
}

export interface CategorySharePicture {
  mediaFileId: number;
  url: string | null;
}

/** Languages without any site text, or `null` when the list did not say. */
export function missingContentLanguages(category: AdminCategory): ContentLanguage[] | null {
  if (category.filledLanguages === null) return null;
  return (['uk', 'ru'] as const).filter(
    (language) => !category.filledLanguages?.includes(language),
  );
}
