import {
  clearCalculation,
  enqueueDraftDelete,
  enqueueDraftSave,
  enqueueOrder,
  updateCalculation,
  useOutbox,
  useStoredCalculation,
} from '@mobile/calculation/data-access';
import {
  calculationTotals,
  clampQuantity,
  priceLine,
  type CalculationLine,
} from '@mobile/calculation/model';
import { useLineProducts } from '@mobile/catalog/data-access';
import { useLocalDatabase } from '@mobile/core/local-db';
import { useMemo } from 'react';

import { useRemovedLineStore } from './use-removed-line';

/** The customer's calculation priced with current customer prices, and what the manager can do with it. */
export function useCalculationController(counterpartyId: string, customerName: string) {
  const db = useLocalDatabase();
  const calculation = useStoredCalculation(counterpartyId);
  const productIds = useMemo(
    () => calculation.lines.map((line) => line.productId),
    [calculation.lines],
  );
  const byId = useLineProducts(productIds, counterpartyId);
  const outbox = useOutbox();

  const lines = useMemo(
    () => calculation.lines.map((line) => priceLine(line, byId.get(line.productId) ?? null)),
    [byId, calculation.lines],
  );
  const totals = calculationTotals(lines);
  const entries = outbox.filter(
    (entry) => entry.counterpartyId === counterpartyId && entry.kind !== 'draft-delete',
  );

  const changeLine = (productId: number, change: (line: CalculationLine) => CalculationLine) =>
    updateCalculation(db, counterpartyId, (current) => ({
      ...current,
      lines: current.lines.map((line) => (line.productId === productId ? change(line) : line)),
    }));

  return {
    calculation,
    changedIds: new Set(calculation.review?.changedProductIds ?? []),
    entries,
    lines,
    totals,
    /** «Видалити чернетку»: the opened draft is deleted through the queue and the calculation is emptied (R-010). */
    deleteDraft: () => {
      const draft = calculation.sourceDraft;
      if (!draft) return;
      enqueueDraftDelete(db, counterpartyId, { id: draft.id, version: draft.version });
      clearCalculation(db, counterpartyId);
    },
    dismissReview: () =>
      updateCalculation(db, counterpartyId, (current) => ({ ...current, review: null })),
    /** Removes a line and keeps it for «Скасувати». */
    remove: (productId: number) => {
      const index = calculation.lines.findIndex((line) => line.productId === productId);
      const removed = calculation.lines[index];
      if (!removed) return;
      useRemovedLineStore.getState().remember({
        counterpartyId,
        index,
        line: removed,
        name: lines[index]?.product?.name ?? `Товар ${productId}`,
      });
      updateCalculation(db, counterpartyId, (current) => ({
        ...current,
        lines: current.lines.filter((line) => line.productId !== productId),
      }));
    },
    /** «Скасувати»: the last removed line goes back where it stood, unless the product was added again. */
    restoreRemoved: () => {
      const { forget, removed } = useRemovedLineStore.getState();
      forget();
      if (!removed || removed.counterpartyId !== counterpartyId) return;
      updateCalculation(db, counterpartyId, (current) => {
        if (current.lines.some((line) => line.productId === removed.line.productId)) return current;
        const next = [...current.lines];
        next.splice(Math.min(removed.index, next.length), 0, removed.line);
        return { ...current, lines: next };
      });
    },
    saveDraft: (title: string) => enqueueDraftSave(db, counterpartyId, title),
    send: () =>
      enqueueOrder(db, {
        comment: calculation.comment,
        counterpartyId,
        customerName,
        expectedBaseKopecks: Object.fromEntries(
          lines.map((line) => [line.productId, line.baseUnitKopecks ?? 0]),
        ),
        lines: calculation.lines,
        totalKopecks: totals.totalKopecks,
      }),
    setAdjustment: (productId: number, adjustmentKopecks: number) =>
      changeLine(productId, (line) => ({ ...line, adjustmentKopecks })),
    setComment: (comment: string) =>
      updateCalculation(db, counterpartyId, (current) => ({
        ...current,
        comment: comment || null,
      })),
    setQuantity: (productId: number, quantity: number) => {
      const stock = lines.find((line) => line.productId === productId)?.product?.stock ?? quantity;
      changeLine(productId, (line) => ({ ...line, quantity: clampQuantity(quantity, stock) }));
    },
  };
}
