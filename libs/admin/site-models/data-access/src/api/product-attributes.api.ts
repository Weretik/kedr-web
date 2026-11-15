import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapAttributeOptions,
  mapAttributeValueOptions,
  mapCreatedAttributeId,
  mapCreatedValueId,
  mapProductAttributes,
  toSetProductAttributeBody,
} from '../mappers/product-attributes.mapper';

import type {
  AttributeOption,
  AttributeValueOption,
  ProductAttributeInput,
  ProductAttributes,
} from '@admin/site-models/model';

const attributesTag = (productId: number) => ({
  type: 'SiteModels' as const,
  id: `attributes-${productId}`,
});

/**
 * Attribute values and review decisions of one product (spec catalog/006), edited from «Вітрина сайту» and the
 * model card. Every change refreshes the site models data, because values and problems there can change.
 */
export const productAttributesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProductAttributes: build.query<ProductAttributes, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/products/{productId}/attributes', {
            params: { path: { productId } },
            signal,
          }),
          mapProductAttributes,
        ),
      providesTags: (_result, _error, productId) => [attributesTag(productId)],
    }),
    /** All attributes, for «Додати властивість». */
    getAttributeOptions: build.query<AttributeOption[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/catalog-attributes', { signal }), mapAttributeOptions),
      providesTags: [{ type: 'CatalogAttributes', id: 'LIST' }],
    }),
    /** The list values of one attribute, for the value picker. */
    getAttributeValueOptions: build.query<AttributeValueOption[], number>({
      queryFn: (attributeId, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/catalog-attributes/{id}', {
            params: { path: { id: attributeId } },
            signal,
          }),
          mapAttributeValueOptions,
        ),
      providesTags: (_result, _error, attributeId) => [
        { type: 'CatalogAttributes', id: attributeId },
      ],
    }),
    /**
     * A new list attribute made from the model card (spec catalog/007 M-06): a site filter and a model switcher.
     * Returns its id.
     */
    createAttributeOption: build.mutation<number, string>({
      queryFn: (nameUk, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/catalog-attributes', {
            body: {
              nameUk,
              nameRu: null,
              kind: 'enum',
              unit: null,
              code: null,
              slug: null,
              isFilterable: true,
              isVariantAxis: true,
              sortOrder: 100,
            },
            signal,
          }),
          mapCreatedAttributeId,
        ),
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'CatalogAttributes', id: 'LIST' }],
    }),
    /** A new value of an attribute made from the model card. Returns its id. */
    createAttributeValueOption: build.mutation<number, { attributeId: number; nameUk: string }>({
      queryFn: ({ attributeId, nameUk }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/catalog-attributes/{id}/values', {
            params: { path: { id: attributeId } },
            body: {
              nameUk,
              nameRu: null,
              code: null,
              slug: null,
              sortOrder: 100,
              swatchHex: null,
              swatchMediaFileId: null,
            },
            signal,
          }),
          (response) => mapCreatedValueId(response, nameUk),
        ),
      invalidatesTags: (_result, error, { attributeId }) =>
        error
          ? []
          : [
              { type: 'CatalogAttributes', id: attributeId },
              { type: 'CatalogAttributes', id: 'LIST' },
            ],
    }),
    setProductAttribute: build.mutation<
      ProductAttributes,
      { productId: number; attributeId: number; input: ProductAttributeInput }
    >({
      queryFn: ({ productId, attributeId, input }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/products/{productId}/attributes/{attributeId}', {
            params: { path: { productId, attributeId } },
            body: toSetProductAttributeBody(input),
            signal,
          }),
          mapProductAttributes,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    restoreProductAttribute: build.mutation<
      ProductAttributes,
      { productId: number; attributeId: number }
    >({
      queryFn: ({ productId, attributeId }, { signal }) =>
        apiCall(
          apiClient.DELETE('/api/admin/products/{productId}/attributes/{attributeId}/manual', {
            params: { path: { productId, attributeId } },
            signal,
          }),
          mapProductAttributes,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    acceptProductReview: build.mutation<ProductAttributes, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/products/{productId}/review/accept', {
            params: { path: { productId } },
            signal,
          }),
          mapProductAttributes,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    reopenProductReview: build.mutation<ProductAttributes, number>({
      queryFn: (productId, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/products/{productId}/review/reopen', {
            params: { path: { productId } },
            signal,
          }),
          mapProductAttributes,
        ),
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
  }),
});

export const {
  useAcceptProductReviewMutation,
  useCreateAttributeOptionMutation,
  useCreateAttributeValueOptionMutation,
  useGetAttributeOptionsQuery,
  useGetAttributeValueOptionsQuery,
  useGetProductAttributesQuery,
  useReopenProductReviewMutation,
  useRestoreProductAttributeMutation,
  useSetProductAttributeMutation,
} = productAttributesApi;
