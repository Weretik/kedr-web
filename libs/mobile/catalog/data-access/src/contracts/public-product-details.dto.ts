import type { operations } from '@shared/api-contracts';

export type PublicProductDetailsDto =
  operations['getPublicProductBySlug']['responses'][200]['content']['application/json'];
