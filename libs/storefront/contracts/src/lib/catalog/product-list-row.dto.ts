export interface ProductListRowDto {
  id: number;
  name: string;
  productSlug: string;
  photo: string;

  categoryId: number | null;

  inStock: boolean;
  isSale: boolean;
  isNew: boolean;

  price: number | null;
}
