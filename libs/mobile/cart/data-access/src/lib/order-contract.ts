import { z } from 'zod';

import type { CreateAdminOrderPayload } from '@mobile/cart/model';
import type { operations } from '@shared/api-contracts';

type CreateOrderOperation = operations['createAdminOrder'];
type CreateOrderRequestDto = CreateOrderOperation['requestBody']['content']['application/json'];
type CreateOrderResponseDto = CreateOrderOperation['responses'][201]['content']['application/json'];

export interface CreatedAdminOrder {
  orderId: number;
  orderNumber: string;
  syncStatus: 'Pending';
}

const createOrderResponseSchema = z.object({
  orderId: z.number().int().positive(),
  orderNumber: z.string().min(1),
  syncStatus: z.literal('Pending'),
});

export function toCreateOrderRequest(payload: CreateAdminOrderPayload): CreateOrderRequestDto {
  return payload;
}

export function parseCreatedOrder(response: unknown): CreatedAdminOrder {
  return createOrderResponseSchema.parse(response) satisfies CreateOrderResponseDto;
}
