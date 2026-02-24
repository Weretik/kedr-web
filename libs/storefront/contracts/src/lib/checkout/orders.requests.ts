export type CheckoutLineDto = {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
  slug: string;
};

export type CheckoutDto = {
  firstName: string;
  phone: string;
  lines: CheckoutLineDto[];
};
