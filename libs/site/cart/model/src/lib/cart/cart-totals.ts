import type { CartLine } from './cart-types';

export function getCartTotals(lines: readonly CartLine[]) {
  return lines.reduce(
    (totals, line) => ({
      unitCount: totals.unitCount + line.quantity,
      goodsSubtotal: totals.goodsSubtotal + line.quantity * line.snapshot.unitPrice,
    }),
    { unitCount: 0, goodsSubtotal: 0 },
  );
}
