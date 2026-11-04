import { validateCheckoutDraft } from './checkout-validation';
import { isNonEmptyString, isPositivePrice, isRecord } from '../cart/cart-validation';
import { isCartQuantity } from '../cart/quantity';

import type {
  CheckoutCommandIssue,
  CheckoutCommandLine,
  CheckoutCommandParseResult,
  CheckoutDraft,
} from './checkout-types';
import type { CartLine } from '../cart/cart-types';

export function buildCheckoutCommand(
  draft: CheckoutDraft,
  lines: readonly CartLine[],
): CheckoutCommandParseResult {
  return parseCheckoutCommand({
    firstName: draft.firstName,
    phone: draft.phone,
    lines: lines.map((line) => ({
      productId: line.variantId,
      title: line.snapshot.title,
      unitPrice: line.snapshot.unitPrice,
      quantity: line.quantity,
    })),
  });
}

export function parseCheckoutCommand(input: unknown): CheckoutCommandParseResult {
  if (!isRecord(input)) return { ok: false, fieldErrors: {}, issues: ['invalid-command'] };
  const draft = {
    firstName: typeof input.firstName === 'string' ? input.firstName.trim() : '',
    phone: typeof input.phone === 'string' ? input.phone : '',
  };
  const { valid, fieldErrors } = validateCheckoutDraft(draft);
  const issues = new Set<CheckoutCommandIssue>();
  const lines: CheckoutCommandLine[] = [];
  const identities = new Set<string>();
  if (!Array.isArray(input.lines)) issues.add('invalid-command');
  else if (!input.lines.length) issues.add('empty-cart');
  else {
    for (const line of input.lines) {
      if (
        !isRecord(line) ||
        !isNonEmptyString(line.productId) ||
        !isNonEmptyString(line.title) ||
        !isPositivePrice(line.unitPrice) ||
        !isCartQuantity(line.quantity)
      ) {
        issues.add('invalid-line');
        continue;
      }
      if (identities.has(line.productId)) issues.add('duplicate-product');
      identities.add(line.productId);
      lines.push({
        productId: line.productId,
        title: line.title,
        unitPrice: line.unitPrice,
        quantity: line.quantity,
      });
    }
  }
  if (!valid || issues.size) return { ok: false, fieldErrors, issues: [...issues] };
  return { ok: true, command: { ...draft, lines } };
}
