import type { CheckoutCommand, CheckoutResult } from '@site/cart/model';

/**
 * One order attempt carries one `requestKey` (idempotency key): a retry of the same order reuses it; a changed
 * order, a conflict, a validation error or a success starts a new one.
 */
export function createOrderAttempt(newRequestKey: () => string = () => crypto.randomUUID()) {
  let attempt: { order: string; requestKey: string } | undefined;
  return {
    keyFor: (command: CheckoutCommand): string => {
      const order = JSON.stringify(command);
      if (attempt?.order !== order) attempt = { order, requestKey: newRequestKey() };
      return attempt.requestKey;
    },
    finish: (result: CheckoutResult) => {
      // Only an unknown outcome is repeated with the same key; anything else ends the attempt.
      if (result.kind !== 'uncertain') attempt = undefined;
    },
  };
}
