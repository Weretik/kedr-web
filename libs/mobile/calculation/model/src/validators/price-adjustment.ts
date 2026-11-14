/** The lowest unit price a discount may reach: 1 ₴ (KedrStore `price_below_minimum`). */
export const minimumUnitKopecks = 100;
const maximumAdjustmentKopecks = 100_000_000;

export type AdjustmentParse =
  { kind: 'ok'; kopecks: number } | { kind: 'invalid'; message: string };

/**
 * Reads «± ₴/шт» as typed: «-10», «−10», «+5», «5» (a bare number is a markup), «12,50». Empty is 0 (R-009).
 */
export function parseAdjustment(text: string): AdjustmentParse {
  const compact = text.replace(/\s/g, '').replace('−', '-').replace(',', '.');
  if (compact === '' || compact === '-' || compact === '+') return { kind: 'ok', kopecks: 0 };
  if (!/^[+-]?\d+(\.\d{1,2})?$/.test(compact)) {
    return { kind: 'invalid', message: 'Введіть суму в гривнях, наприклад −10 або 5' };
  }
  const kopecks = Math.round(Number(compact) * 100);
  if (Math.abs(kopecks) > maximumAdjustmentKopecks) {
    return { kind: 'invalid', message: 'Завелика сума' };
  }
  return { kind: 'ok', kopecks };
}

/** «−10», «+5», «0»; kopecks only when they are not zero. */
export function formatAdjustment(kopecks: number): string {
  if (kopecks === 0) return '0';
  const sign = kopecks < 0 ? '−' : '+';
  const value = Math.abs(kopecks) / 100;
  const text = Number.isInteger(value) ? value.toString() : value.toFixed(2).replace('.', ',');
  return `${sign}${text}`;
}

/** The biggest allowed discount for a price (negative or 0); a product under 1 ₴ cannot be discounted. */
export function maxDiscountKopecks(baseUnitKopecks: number): number {
  return baseUnitKopecks <= minimumUnitKopecks ? 0 : -(baseUnitKopecks - minimumUnitKopecks);
}

/** Why the adjustment cannot be used for that price, or null (SC-012). */
export function adjustmentProblem(
  baseUnitKopecks: number,
  adjustmentKopecks: number,
): string | null {
  if (adjustmentKopecks >= 0) return null;
  if (baseUnitKopecks + adjustmentKopecks >= minimumUnitKopecks) return null;
  const allowed = maxDiscountKopecks(baseUnitKopecks);
  return allowed === 0
    ? 'Ціна не може бути нижче 1 ₴: знижка для цього товару неможлива'
    : `Ціна не може бути нижче 1 ₴: найбільша знижка ${formatAdjustment(allowed)}`;
}
