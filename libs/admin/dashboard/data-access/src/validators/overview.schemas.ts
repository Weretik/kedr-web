import { z } from 'zod';

/** Runtime shapes of the three «Огляд» blocks; mappers receive data that passed these schemas. */
export const workspaceOverviewSchema = z.object({
  ordersToday: z.number().int().nonnegative(),
  draftCount: z.number().int().nonnegative(),
  syncProblemCount: z.number().int().nonnegative(),
  syncProblems: z.array(
    z.object({
      orderId: z.number(),
      orderNumber: z.string(),
      counterpartyName: z.string(),
      createdAtUtc: z.string(),
      syncStatus: z.enum(['BusinessError', 'DeadLetter']),
      errorMessage: z.string().nullable(),
    }),
  ),
  latestOrders: z.array(
    z.object({
      orderId: z.number(),
      orderNumber: z.string(),
      counterpartyName: z.string(),
      createdAtUtc: z.string(),
      totalAmount: z.number(),
      syncStatus: z.string(),
    }),
  ),
});

export const catalogOverviewSchema = z.object({
  productsWithoutPhoto: z.number().int().nonnegative(),
  topCategoryWithoutPhoto: z
    .object({ id: z.number(), name: z.string(), count: z.number().int() })
    .nullable(),
  categoriesWithoutText: z.number().int().nonnegative(),
  productsWithProblems: z.number().int().nonnegative().default(0),
  noNameProducts: z.number().int().nonnegative().default(0),
});

export const contentOverviewSchema = z.object({
  articleDrafts: z.number().int().nonnegative(),
  oldestArticleDraft: z
    .object({ id: z.number(), title: z.string(), updatedAt: z.string() })
    .nullable(),
  legacyArticleCovers: z.number().int().nonnegative(),
  documentDrafts: z.number().int().nonnegative(),
});
