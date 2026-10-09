import { AppErrorFactory } from '@shared/util';
import { z } from 'zod';

const orderCreatedSchema = z.object({ orderId: z.string().uuid() });

export function parseOrderCreated(response: unknown) {
  const parsed = orderCreatedSchema.safeParse(response);
  if (!parsed.success) throw AppErrorFactory.unknown(parsed.error);
  return parsed.data;
}
