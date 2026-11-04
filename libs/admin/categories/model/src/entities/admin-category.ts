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
  /** Active products here and in descendants; `null` when the server did not count them. */
  productCount: number | null;
  /** Languages with any site text; `null` when unknown (deleted rows, single reads). */
  filledLanguages: readonly ContentLanguage[] | null;
}

/** Languages without any site text, or `null` when the list did not say. */
export function missingContentLanguages(category: AdminCategory): ContentLanguage[] | null {
  if (category.filledLanguages === null) return null;
  return (['uk', 'ru'] as const).filter(
    (language) => !category.filledLanguages?.includes(language),
  );
}
