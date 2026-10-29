import type { components, operations } from '@shared/api-contracts';

export type StaffAccountResponse = components['schemas']['StaffAccountResponse'];
export type CreateStaffAccountBody = components['schemas']['CreateStaffAccountRequest'];
export type ChangeStaffEmailBody =
  operations['changeStaffEmail']['requestBody']['content']['application/json'];
