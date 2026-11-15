import type { components } from '@shared/api-contracts';

/** Provider-owned wire types stay private to this data-access library. */
export type ApiProductDetails = components['schemas']['ProductBySlugDto'];
/** The site reads the page and its rows; the other result fields of the API wrapper are not used. */
export type ApiProductPage = Pick<
  components['schemas']['PagedResultOfListOfProductListRowDto'],
  'pagedInfo' | 'value'
>;
export type ApiProductListItem = components['schemas']['ProductListRowDto'];
export type ApiProductIdentity = Pick<ApiProductListItem, 'id' | 'name' | 'productSlug'>;
export type ApiCatalogRedirect = components['schemas']['CatalogRedirect'];
export type ApiSiteModel = components['schemas']['PublicSiteModelDto'];
export type ApiSiteModelProduct = components['schemas']['PublicSiteModelProductDto'];
export type ApiSiteModelAxis = components['schemas']['PublicSiteModelAxisDto'];
export type ApiSiteModelAddress = components['schemas']['PublicSiteModelAddressDto'];
export type ApiSiteModelList = components['schemas']['PublicSiteModelListDto'];
