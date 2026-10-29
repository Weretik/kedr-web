import { adjustedLine, adjustedPriceIssue } from '@admin/orders/model';

import type { CatalogLineInfo, OrderInputLine, OrderQuote } from '@admin/orders/model';

export interface LinePriceSources {
  quote: OrderQuote | null;
  previewQuote?: OrderQuote | null;
  /** Customer unit prices by product ID, read before a full quote is available. */
  customerPrices?: Record<string, number | null>;
  /** True once a customer is chosen: retail catalog prices are then never shown as the price. */
  hasCustomer: boolean;
  catalog: Map<string, CatalogLineInfo>;
}

export interface LinePricing {
  productName: string;
  baseUnitPrice: number | null;
  unitPrice: number | null;
  lineAmount: number | null;
  /** True while the price is the retail catalog price because no customer is chosen yet. */
  retail: boolean;
  /** Why the line cannot be ordered as entered, for example a discount above the price. */
  issue: string | null;
}

/** Picks the best known price for a line: current quote, last quote, customer prices, then retail. */
export function priceLine(line: OrderInputLine, sources: LinePriceSources): LinePricing {
  const current = sources.quote?.lines.find((item) => item.productId === line.productId);
  const previous = sources.previewQuote?.lines.find((item) => item.productId === line.productId);
  const product = sources.catalog.get(line.productId);
  const customerPrice = sources.customerPrices?.[line.productId];
  const retail = !sources.hasCustomer;
  const baseUnitPrice =
    current?.baseUnitPrice ??
    previous?.baseUnitPrice ??
    (retail ? product?.unitPrice : customerPrice) ??
    null;
  const productName =
    current?.productName ??
    previous?.productName ??
    product?.productName ??
    'Назва товару недоступна';
  if (current)
    return {
      productName,
      baseUnitPrice,
      unitPrice: current.unitPrice,
      lineAmount: current.lineAmount,
      retail: false,
      issue: null,
    };
  if (baseUnitPrice === null)
    return { productName, baseUnitPrice, unitPrice: null, lineAmount: null, retail, issue: null };
  return {
    productName,
    baseUnitPrice,
    ...adjustedLine(baseUnitPrice, line.priceAdjustment ?? 0, line.quantity),
    retail,
    issue: adjustedPriceIssue(baseUnitPrice, line.priceAdjustment ?? 0),
  };
}
