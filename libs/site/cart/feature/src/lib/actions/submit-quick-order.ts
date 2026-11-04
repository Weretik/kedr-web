'use server';

import { createQuickOrder } from '@site/cart/data-access';
import { parseCheckoutCommand } from '@site/cart/model';

import type { CheckoutResult } from '@site/cart/model';

export async function submitQuickOrder(input: unknown): Promise<CheckoutResult> {
  const parsed = parseCheckoutCommand(input);
  if (!parsed.ok) {
    return { kind: 'validation', fieldErrors: parsed.fieldErrors, messages: parsed.issues };
  }

  try {
    return await createQuickOrder(parsed.command);
  } catch {
    return { kind: 'uncertain', messages: [] };
  }
}
