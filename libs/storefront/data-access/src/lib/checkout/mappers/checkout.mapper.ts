import { CartLine, CheckoutDto, CheckoutLineDto } from '@storefront/contracts';

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
    slug: x.snapshot.slug,
  }));

  return {
    firstName: contact.firstName,
    phone: contact.phone,
    lines,
  };
}
