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
}
