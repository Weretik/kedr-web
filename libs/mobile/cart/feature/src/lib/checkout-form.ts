import { z } from 'zod';

export const checkoutFormSchema = z.object({
  comment: z.string().trim().max(1000, 'Коментар не може перевищувати 1000 символів.'),
  counterpartyId: z.string().trim().min(1, 'Оберіть клієнта.'),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function createIdempotencyKey(): string {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();

  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const random = Math.floor(Math.random() * 16);
    const value = token === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}
