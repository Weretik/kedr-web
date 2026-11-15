import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapCreatedOrder,
  mapCustomerPrices,
  mapDraftPage,
  mapDraftRecord,
  mapOrderPage,
  mapOrderRecord,
  mapQuote,
  toInputLines,
} from '../mappers/orders.mapper';

import type {
  CreatedOrder,
  DraftInput,
  DraftRecord,
  DraftSummary,
  ListQuery,
  OrderInputLine,
  OrderQuote,
  OrderRecord,
  OrderSummary,
  Page,
} from '@admin/orders/model';
import type { operations } from '@shared/api-contracts';

type QuoteBody =
  operations['quoteAdminWorkspaceOrder']['requestBody']['content']['application/json'];
type CreateOrderBody =
  operations['createAdminWorkspaceOrder']['requestBody']['content']['application/json'];
type DraftBody = operations['createAdminOrderDraft']['requestBody']['content']['application/json'];
type CustomerPricesBody =
  operations['getAdminWorkspaceCustomerPrices']['requestBody']['content']['application/json'];

interface CreateOrderArgs {
  counterpartyId: string;
  lines: OrderInputLine[];
  quoteFingerprint: string;
  comment?: string;
  idempotencyKey: string;
}
interface CreateDraftArgs {
  input: DraftInput;
  idempotencyKey: string;
}
interface UpdateDraftArgs {
  draftId: number;
  version: string;
  input: DraftInput;
}
interface DeleteDraftArgs {
  draftId: number;
  version: string;
}

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getWorkspaceOrders: build.query<Page<OrderSummary>, ListQuery>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/order-workspace/orders', { params: { query: params }, signal }),
          mapOrderPage,
        ),
      providesTags: ['AdminOrders'],
    }),
    getWorkspaceOrder: build.query<OrderRecord, number>({
      queryFn: (orderId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/order-workspace/orders/{orderId}', {
            params: { path: { orderId } },
            signal,
          }),
          mapOrderRecord,
        ),
      providesTags: ['AdminOrders'],
    }),
    quoteWorkspaceOrder: build.mutation<
      OrderQuote,
      { counterpartyId: string; lines: OrderInputLine[] }
    >({
      queryFn: ({ counterpartyId, lines }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/order-workspace/quote', {
            body: { counterpartyId, lines: toInputLines(lines) } satisfies QuoteBody,
            signal,
          }),
          mapQuote,
        ),
    }),
    getWorkspaceCustomerPrices: build.query<
      Record<string, number | null>,
      { counterpartyId: string; productIds: string[] }
    >({
      queryFn: (body, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/order-workspace/customer-prices', {
            body: body satisfies CustomerPricesBody,
            signal,
          }),
          mapCustomerPrices,
        ),
    }),
    createWorkspaceOrder: build.mutation<CreatedOrder, CreateOrderArgs>({
      queryFn: ({ idempotencyKey, lines, ...body }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/order-workspace/orders', {
            body: {
              ...body,
              comment: body.comment ?? null,
              lines: toInputLines(lines),
            } satisfies CreateOrderBody,
            headers: { 'Idempotency-Key': idempotencyKey },
            signal,
          }),
          mapCreatedOrder,
        ),
      invalidatesTags: ['AdminOrders'],
    }),
    getWorkspaceDrafts: build.query<Page<DraftSummary>, ListQuery>({
      queryFn: (params, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/order-workspace/drafts', { params: { query: params }, signal }),
          mapDraftPage,
        ),
      providesTags: ['AdminOrderDrafts'],
    }),
    getWorkspaceDraft: build.query<DraftRecord, number>({
      queryFn: (draftId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/order-workspace/drafts/{draftId}', {
            params: { path: { draftId } },
            signal,
          }),
          mapDraftRecord,
        ),
      providesTags: ['AdminOrderDrafts'],
    }),
    createWorkspaceDraft: build.mutation<DraftRecord, CreateDraftArgs>({
      queryFn: ({ input, idempotencyKey }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/order-workspace/drafts', {
            body: { ...input, lines: toInputLines(input.lines) } satisfies DraftBody,
            headers: { 'Idempotency-Key': idempotencyKey },
            signal,
          }),
          mapDraftRecord,
        ),
      invalidatesTags: ['AdminOrderDrafts'],
    }),
    updateWorkspaceDraft: build.mutation<DraftRecord, UpdateDraftArgs>({
      queryFn: ({ draftId, version, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/order-workspace/drafts/{draftId}', {
            params: { path: { draftId } },
            body: { ...input, lines: toInputLines(input.lines) } satisfies DraftBody,
            headers: { 'If-Match': version },
            signal,
          }),
          mapDraftRecord,
        ),
      invalidatesTags: ['AdminOrderDrafts'],
    }),
    deleteWorkspaceDraft: build.mutation<void, DeleteDraftArgs>({
      queryFn: ({ draftId, version }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/admin/order-workspace/drafts/{draftId}', {
            params: { path: { draftId } },
            headers: { 'If-Match': version },
            signal,
          }),
        ),
      invalidatesTags: ['AdminOrderDrafts'],
    }),
  }),
});

export const {
  useGetWorkspaceOrdersQuery,
  useGetWorkspaceOrderQuery,
  useQuoteWorkspaceOrderMutation,
  useGetWorkspaceCustomerPricesQuery,
  useCreateWorkspaceOrderMutation,
  useGetWorkspaceDraftsQuery,
  useGetWorkspaceDraftQuery,
  useLazyGetWorkspaceDraftQuery,
  useCreateWorkspaceDraftMutation,
  useUpdateWorkspaceDraftMutation,
  useDeleteWorkspaceDraftMutation,
} = ordersApi;
