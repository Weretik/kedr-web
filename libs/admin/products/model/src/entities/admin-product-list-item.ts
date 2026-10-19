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
}
