import type { operations } from '@shared/api-contracts';

export type AdminProductPageDto =
  operations['getAdminProducts']['responses'][200]['content']['application/json'];
