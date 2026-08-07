interface AdminCategoryDto {
  id: number;
  level: number;
  name: string;
  parentId: number | null;
  productTypeIdOneC: string;
  shortNameRu: string;
  shortNameUk: string;
  slug: string;
  sortOrder: number;
}

export type { AdminCategoryDto };
