import { baseApi } from '@admin/shared/api-client';

import {
  mapCreatedOrder,
  mapDraftPage,
  mapDraftRecord,
  mapOrderPage,
  mapOrderRecord,
  mapQuote,
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
const root = '/api/admin/order-workspace';

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
      query: (params) => ({ url: `${root}/orders`, params }),
      transformResponse: mapOrderPage,
      providesTags: ['AdminOrders'],
    }),
    getWorkspaceOrder: build.query<OrderRecord, number>({
      query: (orderId) => ({ url: `${root}/orders/${orderId}` }),
      transformResponse: mapOrderRecord,
      providesTags: ['AdminOrders'],
    }),
    quoteWorkspaceOrder: build.mutation<
      OrderQuote,
      { counterpartyId: string; lines: OrderInputLine[] }
    >({
      query: (body) => ({ url: `${root}/quote`, method: 'POST', data: body satisfies QuoteBody }),
      transformResponse: mapQuote,
    }),
    createWorkspaceOrder: build.mutation<CreatedOrder, CreateOrderArgs>({
      query: ({ idempotencyKey, ...body }) => ({
        url: `${root}/orders`,
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        data: body satisfies CreateOrderBody,
      }),
      transformResponse: mapCreatedOrder,
      invalidatesTags: ['AdminOrders'],
    }),
    getWorkspaceDrafts: build.query<Page<DraftSummary>, ListQuery>({
      query: (params) => ({ url: `${root}/drafts`, params }),
      transformResponse: mapDraftPage,
      providesTags: ['AdminOrderDrafts'],
    }),
    getWorkspaceDraft: build.query<DraftRecord, number>({
      query: (draftId) => ({ url: `${root}/drafts/${draftId}` }),
      transformResponse: mapDraftRecord,
      providesTags: ['AdminOrderDrafts'],
    }),
    createWorkspaceDraft: build.mutation<DraftRecord, CreateDraftArgs>({
      query: ({ input, idempotencyKey }) => ({
        url: `${root}/drafts`,
        method: 'POST',
        headers: { 'Idempotency-Key': idempotencyKey },
        data: input satisfies DraftBody,
      }),
      transformResponse: mapDraftRecord,
      invalidatesTags: ['AdminOrderDrafts'],
    }),
    updateWorkspaceDraft: build.mutation<DraftRecord, UpdateDraftArgs>({
      query: ({ draftId, version, input }) => ({
        url: `${root}/drafts/${draftId}`,
        method: 'PUT',
        headers: { 'If-Match': version },
        data: input satisfies DraftBody,
      }),
      transformResponse: mapDraftRecord,
      invalidatesTags: ['AdminOrderDrafts'],
    }),
    deleteWorkspaceDraft: build.mutation<void, DeleteDraftArgs>({
      query: ({ draftId, version }) => ({
        url: `${root}/drafts/${draftId}`,
        method: 'DELETE',
        headers: { 'If-Match': version },
      }),
      invalidatesTags: ['AdminOrderDrafts'],
    }),
  }),
});

export const {
  useGetWorkspaceOrdersQuery,
  useGetWorkspaceOrderQuery,
  useQuoteWorkspaceOrderMutation,
  useCreateWorkspaceOrderMutation,
  useGetWorkspaceDraftsQuery,
  useGetWorkspaceDraftQuery,
  useLazyGetWorkspaceDraftQuery,
  useCreateWorkspaceDraftMutation,
  useUpdateWorkspaceDraftMutation,
  useDeleteWorkspaceDraftMutation,
} = ordersApi;
