import 'server-only';

import { parseCheckoutCommand } from '@site/cart/model';
import { siteApiCreateQuickOrder } from '@site/shared/api-client';

import { parseQuickOrderResult } from '../contracts/order-response';

import type { CreateQuickOrderDto } from '../contracts/order-contracts';
import type { CheckoutCommand, CheckoutResult } from '@site/cart/model';

export async function createQuickOrder(command: CheckoutCommand): Promise<CheckoutResult> {
  const parsed = parseCheckoutCommand(command);
  if (!parsed.ok) {
    return { kind: 'validation', fieldErrors: parsed.fieldErrors, messages: parsed.issues };
  }

  const request: CreateQuickOrderDto = {
    firstName: parsed.command.firstName,
    phone: parsed.command.phone,
    lines: parsed.command.lines.map(({ productId, title, unitPrice, quantity }) => ({
      productId,
      title,
      unitPrice,
      quantity,
    })),
  };

  try {
    return parseQuickOrderResult(await siteApiCreateQuickOrder(request));
  } catch {
    return { kind: 'uncertain', messages: [] };
  }
}
