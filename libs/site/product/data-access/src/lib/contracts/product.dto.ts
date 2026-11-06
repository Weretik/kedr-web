import type { components } from '@shared/api-contracts';

/** Provider-owned wire types stay private to this data-access library. */
export type ApiProductDetails = components['schemas']['ProductDetails'];
export type ApiProductPage = components['schemas']['ProductPage'];
export type ApiProductListItem = components['schemas']['ProductListItem'];
export type ApiProductIdentity = Pick<ApiProductListItem, 'id' | 'name' | 'productSlug'>;
export type ApiCatalogRedirect = components['schemas']['CatalogRedirect'];
export type ApiSiteModel = components['schemas']['PublicSiteModel'];
export type ApiSiteModelProduct = components['schemas']['PublicSiteModelProduct'];
export type ApiSiteModelAxis = components['schemas']['PublicSiteModelAxis'];
export type ApiSiteModelAddress = components['schemas']['PublicSiteModelAddress'];
export type ApiSiteModelList = components['schemas']['PublicSiteModelList'];
