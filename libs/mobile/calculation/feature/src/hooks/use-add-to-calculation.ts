import {
  updateCalculation,
  useOutbox,
  useStoredCalculation,
} from '@mobile/calculation/data-access';
import { addProduct, type LineProduct } from '@mobile/calculation/model';
import { useLocalDatabase } from '@mobile/core/local-db';
import { useSelectedCustomer } from '@mobile/customers/data-access';

/** «+» on a product: adds it, or one more of it, to the chosen customer's calculation (R-009, SC-024). */
export function useAddToCalculation(): ((product: LineProduct) => void) | undefined {
  const db = useLocalDatabase();
  const counterpartyId = useSelectedCustomer()?.counterpartyId ?? null;
  if (counterpartyId === null) return undefined;
  return (product) =>
    updateCalculation(db, counterpartyId, (current) => ({
      ...current,
      lines: addProduct(current.lines, product),
    }));
}

/** «Розрахунок · N» for the chosen customer and «Замовлення · N» for everything still waiting in the queue. */
export function useCalculationBadges(): { calculation?: number; orders?: number } {
  const counterpartyId = useSelectedCustomer()?.counterpartyId ?? '';
  const lineCount = useStoredCalculation(counterpartyId).lines.length;
  const waiting = useOutbox().filter(
    (entry) => entry.kind === 'order-create' && entry.state !== 'done',
  ).length;
  return {
    calculation: lineCount > 0 ? lineCount : undefined,
    orders: waiting > 0 ? waiting : undefined,
  };
}
