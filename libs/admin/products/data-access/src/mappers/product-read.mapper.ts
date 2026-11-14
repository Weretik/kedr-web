import { publicCategoryNamesUk } from './public-category-names.uk';
import { adminProductDetailsSchema } from '../validators/admin-product.schemas';

import type { ProductDetails } from '@admin/products/model';
import type { operations } from '@shared/api-contracts';

type AdminDetailResponse =
  operations['getAdminProductBySlug']['responses'][200]['content']['application/json'];

export function mapAdminProductDetailsResponse(response: unknown): ProductDetails {
  const detail = adminProductDetailsSchema.parse(response);
  return {
    ...detail,
    categoryName: publicCategoryNamesUk[detail.categoryId] ?? detail.categoryName,
  } satisfies AdminDetailResponse;
}
