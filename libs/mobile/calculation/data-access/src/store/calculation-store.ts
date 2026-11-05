import {
  calculationLines,
  calculations,
  markLocalDataChanged,
  type LocalDatabase,
} from '@mobile/core/local-db';
import { asc, eq } from 'drizzle-orm';

import type { CalculationLine, OutboxReview } from '@mobile/calculation/model';

export interface SourceDraft {
  id: number;
  version: string;
  title: string;
}

/** The customer's calculation as the device keeps it (R-009). */
export interface StoredCalculation {
  counterpartyId: string;
  lines: CalculationLine[];
  comment: string | null;
  sourceDraft: SourceDraft | null;
  review: OutboxReview | null;
}

export function readCalculation(db: LocalDatabase, counterpartyId: string): StoredCalculation {
  const head = db
    .select()
    .from(calculations)
    .where(eq(calculations.counterpartyId, counterpartyId))
    .get();
  const lines = db
    .select()
    .from(calculationLines)
    .where(eq(calculationLines.counterpartyId, counterpartyId))
    .orderBy(asc(calculationLines.position))
    .all()
    .map(({ adjustmentKopecks, productId, quantity }) => ({
      adjustmentKopecks,
      productId,
      quantity,
    }));
  const sourceDraft =
    head?.sourceDraftId != null && head.sourceDraftVersion != null
      ? {
          id: head.sourceDraftId,
          title: head.sourceDraftTitle ?? '',
          version: head.sourceDraftVersion,
        }
      : null;
  return {
    comment: head?.comment ?? null,
    counterpartyId,
    lines,
    review: head?.review ?? null,
    sourceDraft,
  };
}

/** Writes the whole calculation in one transaction; an empty one without a draft or review is removed. */
export function writeCalculation(db: LocalDatabase, calculation: StoredCalculation): void {
  const { counterpartyId } = calculation;
  db.transaction((tx) => {
    tx.delete(calculationLines).where(eq(calculationLines.counterpartyId, counterpartyId)).run();
    tx.delete(calculations).where(eq(calculations.counterpartyId, counterpartyId)).run();
    const isEmpty =
      calculation.lines.length === 0 &&
      !calculation.comment &&
      !calculation.sourceDraft &&
      !calculation.review;
    if (isEmpty) return;
    tx.insert(calculations)
      .values({
        comment: calculation.comment,
        counterpartyId,
        review: calculation.review,
        sourceDraftId: calculation.sourceDraft?.id ?? null,
        sourceDraftTitle: calculation.sourceDraft?.title ?? null,
        sourceDraftVersion: calculation.sourceDraft?.version ?? null,
      })
      .run();
    if (calculation.lines.length > 0) {
      tx.insert(calculationLines)
        .values(calculation.lines.map((line, position) => ({ ...line, counterpartyId, position })))
        .run();
    }
  });
  markLocalDataChanged();
}

export function updateCalculation(
  db: LocalDatabase,
  counterpartyId: string,
  change: (calculation: StoredCalculation) => StoredCalculation,
): void {
  writeCalculation(db, change(readCalculation(db, counterpartyId)));
}

export function clearCalculation(db: LocalDatabase, counterpartyId: string): void {
  writeCalculation(db, {
    comment: null,
    counterpartyId,
    lines: [],
    review: null,
    sourceDraft: null,
  });
}

/** Number of lines per customer, for the «Розрахунок · N» tab. */
export function countCalculationLines(db: LocalDatabase, counterpartyId: string): number {
  return db
    .select()
    .from(calculationLines)
    .where(eq(calculationLines.counterpartyId, counterpartyId))
    .all().length;
}
