import type { operations } from '@shared/api-contracts';

export type CreateQuickOrderDto =
  operations['createQuickOrder']['requestBody']['content']['application/json'];

export type QuickOrderResponseDto =
  operations['createQuickOrder']['responses'][200]['content']['application/json'];
