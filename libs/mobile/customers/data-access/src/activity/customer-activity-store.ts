import { customerActivity, type LocalDatabase } from '@mobile/core/local-db';
import {
  customerDraftSchema,
  customerOrderSchema,
  type CustomerActivity,
} from '@mobile/customers/model';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

/** The last orders and drafts the device saw for the customer, or null before the first online visit. */
export function readCachedActivity(
  db: LocalDatabase,
  counterpartyId: string,
): CustomerActivity | null {
  const row = db
    .select()
    .from(customerActivity)
    .where(eq(customerActivity.counterpartyId, counterpartyId))
    .get();
  if (!row) return null;

  const orders = z.array(customerOrderSchema).safeParse(row.orders);
  const drafts = z.array(customerDraftSchema).safeParse(row.drafts);
  if (!orders.success || !drafts.success) return null;
  return { drafts: drafts.data, fetchedAt: row.fetchedAt, orders: orders.data };
}

export function saveActivity(
  db: LocalDatabase,
  counterpartyId: string,
  activity: CustomerActivity,
): void {
  const values = {
    drafts: activity.drafts,
    fetchedAt: activity.fetchedAt,
    orders: activity.orders,
  };
  db.insert(customerActivity)
    .values({ counterpartyId, ...values })
    .onConflictDoUpdate({ set: values, target: customerActivity.counterpartyId })
    .run();
}
