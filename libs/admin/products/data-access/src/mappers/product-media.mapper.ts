import { productMediaSchema } from '../validators/product-media.schemas';

import type { ProductMedia, ProductMediaChange } from '@admin/products/model';
import type { components } from '@shared/api-contracts';

type SetProductMediaBody = components['schemas']['SetProductMediaRequest'];

export function mapProductMedia(response: unknown): ProductMedia {
  const dto = productMediaSchema.parse(response);
  return { productId: dto.productId, photos: dto.photos, scheme: dto.scheme ?? null };
}

export function toSetProductMediaBody(change: ProductMediaChange): SetProductMediaBody {
  return { photoIds: change.photoIds, schemeId: change.schemeId };
}
