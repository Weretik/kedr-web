import {
  catalogOverviewSchema,
  contentOverviewSchema,
  workspaceOverviewSchema,
} from '../validators/overview.schemas';

import type { DashboardCatalog, DashboardContent, DashboardOrders } from '@admin/dashboard/model';

const syncProblemStatuses = new Set(['BusinessError', 'DeadLetter']);

export function mapDashboardOrders(value: unknown): DashboardOrders {
  const dto = workspaceOverviewSchema.parse(value);
  return {
    ordersToday: dto.ordersToday,
    draftCount: dto.draftCount,
    syncProblemCount: dto.syncProblemCount,
    syncProblems: dto.syncProblems.map((order) => ({
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      counterpartyName: order.counterpartyName,
      createdAt: order.createdAtUtc,
      status: order.syncStatus,
      errorMessage: order.errorMessage?.trim() || null,
    })),
    latestOrders: dto.latestOrders.map((order) => ({
      orderId: order.orderId,
      orderNumber: order.orderNumber,
      counterpartyName: order.counterpartyName,
      createdAt: order.createdAtUtc,
      totalAmount: order.totalAmount,
      hasSyncProblem: syncProblemStatuses.has(order.syncStatus),
    })),
  };
}

export const mapDashboardCatalog = (value: unknown): DashboardCatalog =>
  catalogOverviewSchema.parse(value);

export const mapDashboardContent = (value: unknown): DashboardContent =>
  contentOverviewSchema.parse(value);
