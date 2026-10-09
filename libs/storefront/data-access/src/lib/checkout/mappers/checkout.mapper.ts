import { CheckoutCommand, CheckoutLine } from '@storefront/contracts';

import { CartLine } from '../../cart/models/cart.types';

export type CheckoutContactInput = {
  firstName: string;
  phone: string;
};

export function mapToCheckoutCommand(
  contact: CheckoutContactInput,
  cartLines: CartLine[],
): CheckoutCommand {
  const lines: CheckoutLine[] = cartLines.map((x) => ({
    productId: x.variantId,
    title: x.snapshot.title,
    unitPrice: x.snapshot.unitPrice,
    quantity: x.quantity,
  }));

  return {
    firstName: contact.firstName,
    phone: contact.phone,
    lines,
  };
}
