import type { operations } from '@shared/api-contracts';

export type MissingPhotoProductPageDto =
  operations['getAdminProductsWithUnavailablePhotos']['responses'][200]['content']['application/json'];

export type MissingPhotoProductsQueryDto = NonNullable<
  operations['getAdminProductsWithUnavailablePhotos']['parameters']['query']
>;
