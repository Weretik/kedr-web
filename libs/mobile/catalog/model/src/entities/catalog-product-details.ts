export interface CatalogBreadcrumb {
  id: string;
  name: string;
  slug: string;
}

export interface CatalogProductDetails {
  breadcrumbs: CatalogBreadcrumb[];
  categoryName: string;
  categorySlug: string;
  id: string;
  imageUrl: string | null;
  name: string;
  price: number | null;
  quantityInPack: number;
  schemeUrl: string | null;
  stock: number;
}

export function getProductImageCandidates(product: CatalogProductDetails): string[] {
  return [product.imageUrl, product.schemeUrl].filter(
    (url, index, all): url is string => Boolean(url) && all.indexOf(url) === index,
  );
}
