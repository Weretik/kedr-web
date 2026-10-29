/** Largest per-unit discount or markup, in UAH, the server accepts. */
export const maxPriceAdjustment = 1_000_000;

export type PriceAdjustmentTone = 'discount' | 'markup' | 'none';

export type ParsedPriceAdjustment = { value: number } | { error: string };

/**
 * Reads what a manager typed into "Знижка/Націнка": "-50" is a 50 ₴ discount per unit,
 * "+50" or "50" a markup; a comma works as the decimal separator; empty means 0.
 */
export function parsePriceAdjustment(text: string): ParsedPriceAdjustment {
  const normalized = text.trim().replace(/\s/g, '').replace(',', '.');
  if (normalized === '' || normalized === '+' || normalized === '-') return { value: 0 };
  if (!/^[+-]?\d+(\.\d{1,2})?$/.test(normalized))
    return { error: 'Вкажіть суму в гривнях, до двох знаків після коми.' };
  const value = Number(normalized);
  if (Math.abs(value) > maxPriceAdjustment) return { error: 'Занадто велика сума.' };
  return { value: value === 0 ? 0 : value };
}

export const priceAdjustmentTone = (value: number | undefined): PriceAdjustmentTone =>
  !value ? 'none' : value < 0 ? 'discount' : 'markup';

/** Shows an adjustment with its sign, e.g. "−50,00 ₴" or "+10,50 ₴"; 0 is shown as "—". */
export function formatPriceAdjustment(value: number | undefined): string {
  if (!value) return '—';
  const amount = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(
    Math.abs(value),
  );
  return `${value < 0 ? '−' : '+'}${amount}`;
}

/** Final unit price and line amount, rounded to kopecks like the server. */
export function adjustedLine(baseUnitPrice: number, priceAdjustment: number, quantity: number) {
  const unitPrice = Math.round((baseUnitPrice + priceAdjustment) * 100) / 100;
  return { unitPrice, lineAmount: Math.round(unitPrice * quantity * 100) / 100 };
}
