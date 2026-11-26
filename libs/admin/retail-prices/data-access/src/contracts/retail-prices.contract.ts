import type { components } from '@shared/api-contracts';

export type RetailPriceStatusDto = components['schemas']['RetailPriceStatusDto'];
export type RetailPriceImportResultDto = components['schemas']['RetailPriceImportResultDto'];

/** The owner's 1C price list and whether the 1C sync must leave its prices alone. */
export interface RetailPriceUpload {
  file: Blob;
  protectFromOneC: boolean;
}
