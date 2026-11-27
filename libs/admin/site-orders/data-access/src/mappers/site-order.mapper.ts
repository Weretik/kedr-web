import { siteOrderDetailSchema, siteOrderPageSchema } from '../validators/site-order.schemas';

import type {
  SiteOrderDetailResponse,
  SiteOrderPageResponse,
} from '../contracts/site-order.contract';
import type { SiteOrderDetail, SiteOrderPage } from '@admin/site-orders/model';

export function mapSiteOrderPage(response: unknown): SiteOrderPage {
  const parsed = siteOrderPageSchema.parse(response) satisfies SiteOrderPageResponse;
  return {
    items: (parsed.value ?? []).map((row) => ({
      orderId: row.orderId,
      placedAtUtc: row.placedAtUtc,
      firstName: row.firstName,
      phone: row.phone,
      lineCount: row.lineCount,
      total: row.total,
      telegramStatus: row.telegramStatus,
      telegramLastError: row.telegramLastError,
      oneCOrderId: row.oneCOrderId,
      oneCOrderNumber: row.oneCOrderNumber,
      oneCDocumentNumber: row.oneCDocumentNumber,
    })),
    pageNumber: parsed.pagedInfo.pageNumber,
    pageSize: parsed.pagedInfo.pageSize,
    totalPages: parsed.pagedInfo.totalPages,
    totalRecords: parsed.pagedInfo.totalRecords,
  };
}

export function mapSiteOrderDetail(response: unknown): SiteOrderDetail {
  const parsed = siteOrderDetailSchema.parse(response) satisfies SiteOrderDetailResponse;
  return {
    orderId: parsed.orderId,
    placedAtUtc: parsed.placedAtUtc,
    firstName: parsed.firstName,
    phone: parsed.phone,
    total: parsed.total,
    telegramStatus: parsed.telegramStatus,
    telegramSentAtUtc: parsed.telegramSentAtUtc,
    telegramLastAttemptAtUtc: parsed.telegramLastAttemptAtUtc,
    telegramLastError: parsed.telegramLastError,
    comment: parsed.comment,
    oneCOrderId: parsed.oneCOrderId,
    oneCOrderNumber: parsed.oneCOrderNumber,
    oneCDocumentNumber: parsed.oneCDocumentNumber,
    items: parsed.items.map(({ productId, title, unitPrice, quantity, amount }) => ({
      productId,
      title,
      unitPrice,
      quantity,
      amount,
    })),
  };
}
