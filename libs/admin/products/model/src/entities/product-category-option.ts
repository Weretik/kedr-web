export interface ProductCategoryOption {
  id: number;
  parentId: number | null;
  nameUk: string;
  pathUk: string;
  depth: number;
  hasChildren: boolean;
}
