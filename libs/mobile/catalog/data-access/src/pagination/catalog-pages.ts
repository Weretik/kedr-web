import type { CatalogPage } from '@mobile/catalog/model';

export function mergeCatalogPages(current: CatalogPage, incoming: CatalogPage): void {
  if (incoming.pageNumber === 1) {
    Object.assign(current, incoming);
    return;
  }

  const productsById = new Map(current.items.map((product) => [product.id, product]));
  for (const product of incoming.items) productsById.set(product.id, product);

  current.items = [...productsById.values()];
  current.pageNumber = incoming.pageNumber;
  current.pageSize = incoming.pageSize;
  current.totalPages = incoming.totalPages;
  current.totalRecords = incoming.totalRecords;
}
