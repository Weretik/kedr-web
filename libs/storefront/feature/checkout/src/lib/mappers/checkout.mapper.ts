import {
  CartLine,
  CheckoutDto,
  CheckoutLineDto,
} from '@storefront/data-access';

export type CheckoutContactInput = {
  firstName: string;
  phone: string;
};

export function mapToCheckoutDto(
  contact: CheckoutContactInput,
  cartLines: CartLine[],
): CheckoutDto {
  const lines: CheckoutLineDto[] = cartLines.map((x) => ({
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
