export type CheckoutLine = {
  productId: string;
  title: string;
  unitPrice: number;
  quantity: number;
};

export type CheckoutCommand = {
  firstName: string;
  phone: string;
  lines: CheckoutLine[];
};
