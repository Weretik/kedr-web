import { buildCheckoutCommand, validateCheckoutDraft } from '@site/cart/model';

import type { CartSnapshot } from '../state/cart-client-store';
import type { CheckoutField, CheckoutFieldErrors } from '@site/cart/model';

export function checkoutFieldErrors(snapshot: CartSnapshot): CheckoutFieldErrors {
  const local = validateCheckoutDraft(snapshot.draft).fieldErrors;
  const errors: CheckoutFieldErrors = {};
  for (const field of ['firstName', 'phone'] as CheckoutField[]) {
    if (snapshot.touched[field] && local[field]) errors[field] = local[field];
  }
  if (snapshot.result?.kind === 'validation') Object.assign(errors, snapshot.result.fieldErrors);
  return errors;
}

export function canSubmitCheckout(snapshot: CartSnapshot): boolean {
  return (
    snapshot.hydrated &&
    !snapshot.pending &&
    !snapshot.recoveryRequired &&
    !snapshot.receipt &&
    buildCheckoutCommand(snapshot.draft, snapshot.lines).ok &&
    !(
      snapshot.result?.kind === 'validation' &&
      Object.values(snapshot.result.fieldErrors).some((errors) => errors?.length)
    )
  );
}
