import type { components } from '@shared/api-contracts';

/** Provider-owned wire types stay private to this data-access library. */
export type ApiProductDetails = components['schemas']['ProductDetails'];
export type ApiProductPage = components['schemas']['ProductPage'];
export type ApiProductListItem = components['schemas']['ProductListItem'];
export type ApiProductIdentity = Pick<ApiProductListItem, 'id' | 'name' | 'productSlug'>;
export type ApiCatalogRedirect = components['schemas']['CatalogRedirect'];
