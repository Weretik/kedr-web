import { countUk } from '../plural';

import type { AttentionItem } from '../../entities/attention-item';
import type { DashboardOrders } from '../../entities/dashboard-overview';

/** Orders 1C did not accept. */
export function orderAttention(orders: DashboardOrders): AttentionItem[] {
  const items: AttentionItem[] = [];

  if (orders.syncProblemCount > 0) {
    const numbers = orders.syncProblems.map((order) => `№ ${order.orderNumber}`).join(', ');
    const reason = orders.syncProblems.find((order) => order.errorMessage)?.errorMessage ?? null;
    const single = orders.syncProblemCount === 1 ? orders.syncProblems[0] : undefined;
    items.push({
      kind: 'sync',
      tone: 'error',
      title: `1С не прийняла ${countUk(orders.syncProblemCount, ['замовлення', 'замовлення', 'замовлень'])}`,
      detail: [numbers, reason].filter(Boolean).join(' · ') || null,
      href: single ? `/orders/${single.orderId}` : '/orders',
      actionLabel: 'Відкрити замовлення',
    });
  }

  return items;
}
