import { baseApi } from '@admin/shared/api-client';

import {
  mapAttributeOptions,
  mapAttributeValueOptions,
  mapProblemReasons,
  mapProductAttributes,
  mapProductGroup,
  mapProductGroupMembership,
  mapProductGroupOptions,
  toSetProductAttributeBody,
  toSetProductGroupBody,
} from '../mappers/product-attributes.mapper';

import type { ProblemReasonCount } from '../mappers/product-attributes.mapper';
import type {
  AttributeOption,
  AttributeValueOption,
  ProductAttributeInput,
  ProductAttributes,
  ProductGroup,
  ProductGroupChange,
  ProductGroupMembership,
  ProductGroupOption,
} from '@admin/products/model';

const attributesTag = (productId: number) => ({
  type: 'Products' as const,
  id: `attributes-${productId}`,
});
const groupTag = (productId: number) => ({ type: 'Products' as const, id: `group-${productId}` });
const listTag = { type: 'Products' as const, id: 'LIST' };

/**
 * The product «Властивості» panel (spec catalog/006): attribute values, review decisions, and the variant group.
 * Every change refreshes the list, because its «Група» and problem columns can change.
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
      invalidatesTags: (_result, error, { productId }) =>
        error ? [] : [attributesTag(productId), groupTag(productId), listTag],
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
      invalidatesTags: (_result, error, { productId }) =>
        error ? [] : [attributesTag(productId), groupTag(productId), listTag],
    }),
    acceptProductReview: build.mutation<ProductAttributes, number>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/review/accept`,
        method: 'POST',
      }),
      transformResponse: mapProductAttributes,
      invalidatesTags: (_result, error, productId) =>
        error ? [] : [attributesTag(productId), listTag],
    }),
    reopenProductReview: build.mutation<ProductAttributes, number>({
      query: (productId) => ({
        url: `/api/admin/products/${productId}/review/reopen`,
        method: 'POST',
      }),
      transformResponse: mapProductAttributes,
      invalidatesTags: (_result, error, productId) =>
        error ? [] : [attributesTag(productId), listTag],
    }),
    getProductGroupOfProduct: build.query<ProductGroupMembership, number>({
      query: (productId) => ({ url: `/api/admin/products/${productId}/group`, method: 'GET' }),
      transformResponse: mapProductGroupMembership,
      providesTags: (_result, _error, productId) => [groupTag(productId)],
    }),
    setProductGroupOfProduct: build.mutation<
      ProductGroupMembership,
      { productId: number; change: ProductGroupChange }
    >({
      query: ({ productId, change }) => ({
        url: `/api/admin/products/${productId}/group`,
        method: 'PUT',
        data: toSetProductGroupBody(change),
      }),
      transformResponse: mapProductGroupMembership,
      // Other products of both groups change too, so every open group refreshes.
      invalidatesTags: (_result, error) => (error ? [] : ['Products']),
    }),
    findProductGroups: build.query<ProductGroupOption[], { categoryId: number; search: string }>({
      query: ({ categoryId, search }) => ({
        url: '/api/admin/product-groups',
        method: 'GET',
        params: { categoryId, search: search.trim() || undefined },
      }),
      transformResponse: mapProductGroupOptions,
    }),
    /** «Нова група» from this product; it moves into the new group. */
    createProductGroup: build.mutation<
      ProductGroup,
      { categoryId: number; name: string; productId: number }
    >({
      query: ({ categoryId, name, productId }) => ({
        url: '/api/admin/product-groups',
        method: 'POST',
        data: { categoryId, name, productIds: [productId] },
      }),
      transformResponse: mapProductGroup,
      invalidatesTags: (_result, error) => (error ? [] : ['Products']),
    }),
    setProductGroupMain: build.mutation<ProductGroup, { groupId: number; productId: number }>({
      query: ({ groupId, productId }) => ({
        url: `/api/admin/product-groups/${groupId}/main`,
        method: 'PUT',
        data: { productId },
      }),
      transformResponse: mapProductGroup,
      invalidatesTags: (_result, error) => (error ? [] : ['Products']),
    }),
    getProblemReasons: build.query<ProblemReasonCount[], void>({
      query: () => ({ url: '/api/admin/catalog-attributes/problem-reasons', method: 'GET' }),
      transformResponse: mapProblemReasons,
      providesTags: [listTag],
    }),
  }),
});

export const {
  useAcceptProductReviewMutation,
  useCreateProductGroupMutation,
  useFindProductGroupsQuery,
  useGetAttributeOptionsQuery,
  useGetAttributeValueOptionsQuery,
  useGetProblemReasonsQuery,
  useGetProductAttributesQuery,
  useGetProductGroupOfProductQuery,
  useReopenProductReviewMutation,
  useRestoreProductAttributeMutation,
  useSetProductAttributeMutation,
  useSetProductGroupMainMutation,
  useSetProductGroupOfProductMutation,
} = productAttributesApi;
