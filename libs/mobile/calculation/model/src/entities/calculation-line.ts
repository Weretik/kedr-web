import { adjustmentProblem } from '../validators/price-adjustment';

/**
 * What a line needs to know about its product: the catalog's priced product fits it as is, so the calculation
 * does not depend on the catalog domain.
 */
export interface LineProduct {
  id: number;
  name: string;
  stock: number;
  /** The chosen customer's price; null when the customer has none. */
  priceKopecks: number | null;
}

const isOutOfStock = (product: LineProduct) => product.stock <= 0;

/** A line as the device keeps it: what the manager chose, without prices. */
export interface CalculationLine {
  productId: number;
  quantity: number;
  adjustmentKopecks: number;
}

export type LineProblem =
  'below-minimum' | 'missing-product' | 'no-price' | 'out-of-stock' | 'over-stock';

/** A line with the customer's current price and what is wrong with it, if anything. */
export interface PricedLine extends CalculationLine {
  product: LineProduct | null;
  baseUnitKopecks: number | null;
  unitKopecks: number | null;
  lineKopecks: number | null;
  adjustmentTotalKopecks: number;
  problem: LineProblem | null;
  message: string | null;
}

const messages: Record<Exclude<LineProblem, 'below-minimum' | 'over-stock'>, string> = {
  'missing-product': 'Товару немає в каталозі',
  'no-price': 'Ціну уточнюйте',
  'out-of-stock': 'Немає в наявності',
};

export function priceLine(line: CalculationLine, product: LineProduct | null): PricedLine {
  const base = product?.priceKopecks ?? null;
  const unit = base === null ? null : base + line.adjustmentKopecks;
  const priced: PricedLine = {
    ...line,
    adjustmentTotalKopecks: line.adjustmentKopecks * line.quantity,
    baseUnitKopecks: base,
    lineKopecks: unit === null ? null : unit * line.quantity,
    message: null,
    problem: null,
    product,
    unitKopecks: unit,
  };
  if (!product)
    return { ...priced, message: messages['missing-product'], problem: 'missing-product' };
  if (isOutOfStock(product))
    return { ...priced, message: messages['out-of-stock'], problem: 'out-of-stock' };
  if (base === null) return { ...priced, message: messages['no-price'], problem: 'no-price' };
  const belowMinimum = adjustmentProblem(base, line.adjustmentKopecks);
  if (belowMinimum) return { ...priced, message: belowMinimum, problem: 'below-minimum' };
  if (line.quantity > product.stock) {
    return {
      ...priced,
      message: `На складі лише ${Math.floor(product.stock)} шт.`,
      problem: 'over-stock',
    };
  }
  return priced;
}

/** The quantity a line may have: at least 1 and at most the whole stock (R-006). */
export function clampQuantity(quantity: number, stock: number): number {
  const most = Math.max(1, Math.floor(stock));
  return Math.min(Math.max(1, Math.round(quantity)), most);
}

export interface CalculationTotals {
  lineCount: number;
  /** All pieces across the lines, «4 шт» in the summary. */
  unitCount: number;
  adjustmentKopecks: number;
  totalKopecks: number;
  /** Every line is priced and has no problem: the calculation may be sent or saved. */
  isSendable: boolean;
}

export function calculationTotals(lines: readonly PricedLine[]): CalculationTotals {
  return {
    adjustmentKopecks: lines.reduce((sum, line) => sum + line.adjustmentTotalKopecks, 0),
    isSendable: lines.length > 0 && lines.every((line) => line.problem === null),
    lineCount: lines.length,
    totalKopecks: lines.reduce((sum, line) => sum + (line.lineKopecks ?? 0), 0),
    unitCount: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

/** «1 позиція», «2 позиції», «5 позицій». */
export function positionsLabel(count: number): string {
  const tens = count % 100;
  const ones = count % 10;
  const word =
    ones === 1 && tens !== 11
      ? 'позиція'
      : ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)
        ? 'позиції'
        : 'позицій';
  return `${count} ${word}`;
}

/** Adds a product or one more of it; the result never passes the stock. */
export function addProduct(
  lines: readonly CalculationLine[],
  product: LineProduct,
): CalculationLine[] {
  const existing = lines.find((line) => line.productId === product.id);
  if (!existing) return [...lines, { adjustmentKopecks: 0, productId: product.id, quantity: 1 }];
  return lines.map((line) =>
    line.productId === product.id
      ? { ...line, quantity: clampQuantity(line.quantity + 1, product.stock) }
      : line,
  );
}
