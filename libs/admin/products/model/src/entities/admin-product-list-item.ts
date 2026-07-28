export interface AdminProductListItem {
  id: number;
  nameUk: string;
  nameRu: string;
  productSlug: string;
  photo: string;
  categoryId: number | null;
  inStock: boolean;
  isSale: boolean;
  isNew: boolean;
  price: number | null;
  stock: number;
  quantityInPack: number;
}
