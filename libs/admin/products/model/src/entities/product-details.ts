export interface ProductDetails {
  id: number;
  nameUk: string;
  nameRu: string;
  productSlug: string;
  photo: string;
  scheme: string;
  stock: number;
  categoryId: number | null;
  categoryName: string;
  quantityInPack: number;
  price: number | null;
  inStock: boolean;
  isSale: boolean;
  isNew: boolean;
  exportToSite: boolean;
}
