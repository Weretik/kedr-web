export const MIN_CART_QUANTITY = 1;
export const MAX_CART_QUANTITY = 1000;

export function isCartQuantity(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= MIN_CART_QUANTITY &&
    value <= MAX_CART_QUANTITY
  );
}
