import { calculateLineAmount, type CartLine } from './cart';

export interface CreateAdminOrderLine {
  amount: number;
  productId: string;
  quantity: number;
}

export interface CreateAdminOrderPayload {
  comment: string | null;
  counterpartyId: string;
  lines: CreateAdminOrderLine[];
}

export interface OrderAttempt {
  fingerprint: string;
  idempotencyKey: string;
}

export function createAdminOrderPayload(
  lines: readonly CartLine[],
  counterpartyId: string,
  comment: string,
): CreateAdminOrderPayload {
  const normalizedComment = comment.trim();

  return {
    comment: normalizedComment || null,
    counterpartyId: counterpartyId.trim(),
    lines: lines.map((line) => ({
      amount: calculateLineAmount(line),
      productId: line.id,
      quantity: line.quantity,
    })),
  };
}

export function resolveOrderAttempt(
  payload: CreateAdminOrderPayload,
  current: OrderAttempt | null,
  createKey: () => string,
): OrderAttempt {
  const fingerprint = JSON.stringify(payload);

  if (current?.fingerprint === fingerprint) {
    return current;
  }

  return { fingerprint, idempotencyKey: createKey() };
}
