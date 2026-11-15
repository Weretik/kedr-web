import { apiCall, apiClient, baseApi, formDataBody } from '@admin/shared/api-client';

import {
  mapCatalogAttributeDetails,
  mapCatalogAttributes,
  mapSwatchUpload,
  toNewAttributeBody,
  toValueBody,
} from '../mappers/catalog-attributes.mapper';

import type {
  CatalogAttribute,
  CatalogAttributeChange,
  CatalogAttributeDetails,
  CatalogAttributeValueChange,
  NewCatalogAttribute,
  UploadedSwatch,
} from '@admin/catalog-attributes/model';

const listTag = { type: 'CatalogAttributes' as const, id: 'LIST' };

/** The «Властивості» page (spec catalog/006): Managers read, Admins change. */
export const catalogAttributesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getCatalogAttributes: build.query<CatalogAttribute[], void>({
      queryFn: (_arg, { signal }) =>
        apiCall(apiClient.GET('/api/admin/catalog-attributes', { signal }), mapCatalogAttributes),
      providesTags: [listTag],
    }),
    getCatalogAttribute: build.query<CatalogAttributeDetails, number>({
      queryFn: (id, { signal }) =>
        apiCall(
          apiClient.GET('/api/admin/catalog-attributes/{id}', { params: { path: { id } }, signal }),
          mapCatalogAttributeDetails,
        ),
      providesTags: (_result, _error, id) => [{ type: 'CatalogAttributes', id }],
    }),
    createCatalogAttribute: build.mutation<CatalogAttributeDetails, NewCatalogAttribute>({
      queryFn: (attribute, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/catalog-attributes', {
            body: toNewAttributeBody(attribute),
            signal,
          }),
          mapCatalogAttributeDetails,
        ),
      invalidatesTags: (_result, error) => (error ? [] : [listTag]),
    }),
    updateCatalogAttribute: build.mutation<
      CatalogAttributeDetails,
      { id: number; change: CatalogAttributeChange }
    >({
      queryFn: ({ id, change }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/catalog-attributes/{id}', {
            params: { path: { id } },
            body: {
              ...change,
              nameUk: change.nameUk.trim(),
              nameRu: change.nameRu?.trim() || null,
            },
            signal,
          }),
          mapCatalogAttributeDetails,
        ),
      invalidatesTags: (_result, error, { id }) =>
        error ? [] : [listTag, { type: 'CatalogAttributes', id }, 'Products'],
    }),
    createAttributeValue: build.mutation<
      CatalogAttributeDetails,
      { attributeId: number; change: CatalogAttributeValueChange }
    >({
      queryFn: ({ attributeId, change }, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/catalog-attributes/{id}/values', {
            params: { path: { id: attributeId } },
            body: { ...toValueBody(change), code: null, slug: null },
            signal,
          }),
          mapCatalogAttributeDetails,
        ),
      invalidatesTags: (_result, error, { attributeId }) =>
        error ? [] : [listTag, { type: 'CatalogAttributes', id: attributeId }],
    }),
    updateAttributeValue: build.mutation<
      CatalogAttributeDetails,
      { attributeId: number; valueId: number; change: CatalogAttributeValueChange }
    >({
      queryFn: ({ attributeId, valueId, change }, { signal }) =>
        apiCall(
          apiClient.PUT('/api/admin/catalog-attributes/{id}/values/{valueId}', {
            params: { path: { id: attributeId, valueId } },
            body: toValueBody(change),
            signal,
          }),
          mapCatalogAttributeDetails,
        ),
      invalidatesTags: (_result, error, { attributeId }) =>
        error ? [] : [{ type: 'CatalogAttributes', id: attributeId }, 'Products'],
    }),
    /** Puts a color or decor picture into the media library (CDN `swatches/`); the value takes it on save. */
    uploadAttributeSwatch: build.mutation<UploadedSwatch, Blob>({
      queryFn: (file, { signal }) =>
        apiCall(
          apiClient.POST('/api/admin/catalog-attributes/swatches', {
            ...formDataBody({ file }),
            signal,
          }),
          mapSwatchUpload,
        ),
    }),
  }),
});

export const {
  useCreateAttributeValueMutation,
  useCreateCatalogAttributeMutation,
  useGetCatalogAttributeQuery,
  useGetCatalogAttributesQuery,
  useUpdateAttributeValueMutation,
  useUpdateCatalogAttributeMutation,
  useUploadAttributeSwatchMutation,
} = catalogAttributesApi;
