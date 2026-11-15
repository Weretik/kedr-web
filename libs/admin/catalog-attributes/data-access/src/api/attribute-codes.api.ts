import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapCodeDecisionResult,
  mapCodeProducts,
  mapUnresolvedCodes,
  toCodeDecisionBody,
} from '../mappers/catalog-attributes.mapper';

import type {
  CodeDecision,
  CodeDecisionResult,
  CodeProducts,
  UnresolvedCode,
} from '@admin/catalog-attributes/model';

const codesTag = { type: 'CatalogAttributes' as const, id: 'CODES' };
const codeProductsTag = (aliasId: number) => ({
  type: 'CatalogAttributes' as const,
  id: `code-products-${aliasId}`,
});

/** «Нові коди з 1С»: codes the import could not match to a value, and the decision on each. */
export const attributeCodesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUnresolvedCodes: build.query<UnresolvedCode[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/catalog-attributes/unresolved-codes', { signal }),
          mapUnresolvedCodes,
        ),
      providesTags: [codesTag],
    }),
    decideAttributeCode: build.mutation<
      CodeDecisionResult,
      { aliasId: number; decision: CodeDecision }
    >({
      queryFn: ({ aliasId, decision }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/catalog-attributes/codes/{aliasId}', {
            params: { path: { aliasId } },
            body: toCodeDecisionBody(decision),
            signal,
          }),
          mapCodeDecisionResult,
        ),
      invalidatesTags: (_result, error, { aliasId }) =>
        error ? [] : [codesTag, codeProductsTag(aliasId), 'CatalogAttributes', 'Products'],
    }),
    getCodeProducts: build.query<CodeProducts, number>({
      queryFn: (aliasId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/catalog-attributes/codes/{aliasId}/products', {
            params: { path: { aliasId } },
            signal,
          }),
          mapCodeProducts,
        ),
      providesTags: (_result, _error, aliasId) => [codeProductsTag(aliasId)],
    }),
  }),
});

export const {
  useDecideAttributeCodeMutation,
  useGetCodeProductsQuery,
  useGetUnresolvedCodesQuery,
} = attributeCodesApi;
