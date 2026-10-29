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

const money = (value: number) =>
  new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' }).format(value);

/** Lowest unit price, in UAH, a discount may bring a product to; the server checks the same. */
export const minDiscountedUnitPrice = 1;

/**
 * Explains why a discount cannot be applied: the final unit price must stay at least 1 ₴
 * (a product that already costs less cannot be discounted). Null when the line is fine.
 */
export function adjustedPriceIssue(baseUnitPrice: number, priceAdjustment: number): string | null {
  const floor = Math.min(minDiscountedUnitPrice, baseUnitPrice);
  const unitPrice = Math.round((baseUnitPrice + priceAdjustment) * 100) / 100;
  if (priceAdjustment >= 0 || unitPrice >= floor) return null;
  if (baseUnitPrice <= minDiscountedUnitPrice)
    return `Ціна товару ${money(baseUnitPrice)} — знижку застосувати не можна.`;
  const maxDiscount = Math.round((baseUnitPrice - minDiscountedUnitPrice) * 100) / 100;
  return `Ціна після знижки ${money(unitPrice)}, а має бути щонайменше ${money(minDiscountedUnitPrice)} за шт. Найбільша знижка — ${money(maxDiscount)}.`;
}

/** Shows an adjustment with its sign, e.g. "−50,00 ₴" or "+10,50 ₴"; 0 is shown as "—". */
export function formatPriceAdjustment(value: number | undefined): string {
  if (!value) return '—';
  return `${value < 0 ? '−' : '+'}${money(Math.abs(value))}`;
}

/** Final unit price and line amount, rounded to kopecks like the server. */
export function adjustedLine(baseUnitPrice: number, priceAdjustment: number, quantity: number) {
  const unitPrice = Math.round((baseUnitPrice + priceAdjustment) * 100) / 100;
  return { unitPrice, lineAmount: Math.round(unitPrice * quantity * 100) / 100 };
}
