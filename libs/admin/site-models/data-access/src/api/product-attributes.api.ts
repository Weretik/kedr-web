import { baseApi } from '@admin/shared/api-client';

import {
  mapAttributeOptions,
  mapAttributeValueOptions,
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
      query: (productId) => ({ url: `/api/admin/products/${productId}/attributes`, method: 'GET' }),
      transformResponse: mapProductAttributes,
      providesTags: (_result, _error, productId) => [attributesTag(productId)],
    }),
    /** All attributes, for «Додати властивість». */
    getAttributeOptions: build.query<AttributeOption[], void>({
      query: () => ({ url: '/api/admin/catalog-attributes', method: 'GET' }),
      transformResponse: mapAttributeOptions,
      providesTags: [{ type: 'CatalogAttributes', id: 'LIST' }],
    }),
    /** The list values of one attribute, for the value picker. */
    getAttributeValueOptions: build.query<AttributeValueOption[], number>({
      query: (attributeId) => ({
        url: `/api/admin/catalog-attributes/${attributeId}`,
        method: 'GET',
      }),
      transformResponse: mapAttributeValueOptions,
      providesTags: (_result, _error, attributeId) => [
        { type: 'CatalogAttributes', id: attributeId },
      ],
    }),
    setProductAttribute: build.mutation<
      ProductAttributes,
      { productId: number; attributeId: number; input: ProductAttributeInput }
    >({
      query: ({ productId, attributeId, input }) => ({
        url: `/api/admin/products/${productId}/attributes/${attributeId}`,
        method: 'PUT',
        data: toSetProductAttributeBody(input),
      }),
      transformResponse: mapProductAttributes,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    restoreProductAttribute: build.mutation<
      ProductAttributes,
      { productId: number; attributeId: number }
    >({
      query: ({ productId, attributeId }) => ({
        url: `/api/admin/products/${productId}/attributes/${attributeId}/manual`,
        method: 'DELETE',
      }),
      transformResponse: mapProductAttributes,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    acceptProductReview: build.mutation<ProductAttributes, number>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/review/accept`,
        method: 'POST',
      }),
      transformResponse: mapProductAttributes,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
    reopenProductReview: build.mutation<ProductAttributes, number>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/review/reopen`,
        method: 'POST',
      }),
      transformResponse: mapProductAttributes,
      invalidatesTags: (_result, error) => (error ? [] : ['SiteModels']),
    }),
  }),
});

export const {
  useAcceptProductReviewMutation,
  useGetAttributeOptionsQuery,
  useGetAttributeValueOptionsQuery,
  useGetProductAttributesQuery,
  useReopenProductReviewMutation,
  useRestoreProductAttributeMutation,
  useSetProductAttributeMutation,
} = productAttributesApi;
