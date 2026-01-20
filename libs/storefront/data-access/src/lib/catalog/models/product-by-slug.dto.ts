export interface ProductBySlugDto {
  id: number;
  name: string;
  photo: string;
  scheme: string;
  stock: number;

  categoryName: string;
  categorySlug: string;

  price: number | null;
}
