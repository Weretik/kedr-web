export interface CartProductInput {
  id: string;
  name: string;
  imageUrl: string | null;
  unitPrice: number;
  stock: number;
  quantityInPack: number;
}

export interface CartLine extends CartProductInput {
  quantity: number;
}

export interface CartEligibilityInput {
  price: number | null;
  stock: number;
}

export function canAddProductToCart({ price, stock }: CartEligibilityInput): boolean {
  return typeof price === 'number' && Number.isFinite(price) && price >= 0 && stock > 0;
}

export function addProductToCart(
  lines: readonly CartLine[],
  product: CartProductInput,
): CartLine[] {
  const existing = lines.find((line) => line.id === product.id);

  if (!existing) {
    return [...lines, { ...product, quantity: 1 }];
  }

  return lines.map((line) =>
    line.id === product.id
      ? { ...line, ...product, quantity: Math.min(line.quantity + 1, product.stock) }
      : line,
  );
}

export function incrementCartLine(lines: readonly CartLine[], productId: string): CartLine[] {
  return lines.map((line) =>
    line.id === productId && line.quantity < line.stock
      ? { ...line, quantity: line.quantity + 1 }
      : line,
  );
}

export function decrementCartLine(lines: readonly CartLine[], productId: string): CartLine[] {
  return lines.map((line) =>
    line.id === productId && line.quantity > 1 ? { ...line, quantity: line.quantity - 1 } : line,
  );
}

export function removeCartLine(lines: readonly CartLine[], productId: string): CartLine[] {
  return lines.filter((line) => line.id !== productId);
}

export function clearCart(): CartLine[] {
  return [];
}

export function calculateLineAmount(line: CartLine): number {
  return roundMoney(line.unitPrice * line.quantity);
}

export function calculateCartTotal(lines: readonly CartLine[]): number {
  return roundMoney(lines.reduce((total, line) => total + calculateLineAmount(line), 0));
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}
