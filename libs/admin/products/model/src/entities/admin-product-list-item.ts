export interface AdminProductListItem {
  id: number;
  nameUk: string;
  nameRu: string;
  productSlug: string;
  photo: string;
  categoryId: number | null;
  categoryName: string;
  inStock: boolean;
  isSale: boolean;
  isNew: boolean;
  exportToSite: boolean;
  price: number | null;
  stock: number;
  quantityInPack: number;
  /** Set only for products the 1C import soft-deleted. */
  deletedAt: string | null;
}
