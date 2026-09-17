import type { components, operations } from '@shared/api-contracts';

type GetAdminProducts = operations['getAdminProducts'];

export type AdminProductsListResponse =
  GetAdminProducts['responses'][200]['content']['application/json'];
export type AdminProductsPagedInfo = components['schemas']['PagedInfo'];
export type AdminProductsListParams = NonNullable<GetAdminProducts['parameters']['query']>;
