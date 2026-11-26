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
  /** ID of the site model (product group) the product belongs to; null when it has none. */
  groupId: number | null;
  price: number | null;
  stock: number;
  quantityInPack: number;
  /** Set only for products the 1C import soft-deleted. */
  deletedAt: string | null;
}
