import { baseApi } from '@admin/shared/api-client';

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
    /**
     * A new list attribute made from the model card (spec catalog/007 M-06): a site filter and a model switcher.
     * Returns its id.
     */
    createAttributeOption: build.mutation<number, string>({
      query: (nameUk) => ({
        url: '/api/admin/catalog-attributes',
        method: 'POST',
        data: {
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
      }),
      transformResponse: mapCreatedAttributeId,
      invalidatesTags: (_result, error) =>
        error ? [] : [{ type: 'CatalogAttributes', id: 'LIST' }],
    }),
    /** A new value of an attribute made from the model card. Returns its id. */
    createAttributeValueOption: build.mutation<number, { attributeId: number; nameUk: string }>({
      query: ({ attributeId, nameUk }) => ({
        url: `/api/admin/catalog-attributes/${attributeId}/values`,
        method: 'POST',
        data: {
          nameUk,
          nameRu: null,
          code: null,
          slug: null,
          sortOrder: 100,
          swatchHex: null,
          swatchMediaFileId: null,
        },
      }),
      transformResponse: (response: unknown, _meta, { nameUk }) =>
        mapCreatedValueId(response, nameUk),
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
  useCreateAttributeOptionMutation,
  useCreateAttributeValueOptionMutation,
  useGetAttributeOptionsQuery,
  useGetAttributeValueOptionsQuery,
  useGetProductAttributesQuery,
  useReopenProductReviewMutation,
  useRestoreProductAttributeMutation,
  useSetProductAttributeMutation,
} = productAttributesApi;
