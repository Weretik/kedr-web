import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapLegalDocumentOverviews,
  mapLegalDocumentVersion,
  mapLegalDocumentVersions,
  toSaveDraftBody,
} from '../mappers/legal-document.mapper';

import type {
  LegalDocumentDraft,
  LegalDocumentKind,
  LegalDocumentOverview,
  LegalDocumentVersion,
  LegalDocumentVersionSummary,
} from '@admin/documents/model';

const tag = 'LegalDocuments' as const;

/** Every change of a version can change the list, the history and that version. */
const changed = (kind: LegalDocumentKind, id?: number) => [
  { type: tag, id: 'LIST' },
  { type: tag, id: `versions:${kind}` },
  ...(id ? [{ type: tag, id }] : []),
];

export const adminLegalDocumentsApi = baseApi
  .enhanceEndpoints({ addTagTypes: [tag] })
  .injectEndpoints({
    endpoints: (build) => ({
      getLegalDocuments: build.query<LegalDocumentOverview[], void>({
        queryFn: (_arg, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/content/documents', { signal }),
            mapLegalDocumentOverviews,
          ),
        providesTags: [{ type: tag, id: 'LIST' }],
      }),
      getLegalDocumentVersions: build.query<LegalDocumentVersionSummary[], LegalDocumentKind>({
        queryFn: (kind, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/content/documents/{kind}/versions', {
              params: { path: { kind } },
              signal,
            }),
            mapLegalDocumentVersions,
          ),
        providesTags: (_result, _error, kind) => [{ type: tag, id: `versions:${kind}` }],
      }),
      getLegalDocumentVersion: build.query<LegalDocumentVersion, number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/content/documents/versions/{id}', {
              params: { path: { id } },
              signal,
            }),
            mapLegalDocumentVersion,
          ),
        providesTags: (_result, _error, id) => [{ type: tag, id }],
      }),
      createLegalDocumentDraft: build.mutation<
        LegalDocumentVersion,
        { kind: LegalDocumentKind; draft: LegalDocumentDraft }
      >({
        queryFn: ({ kind, draft }, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/content/documents/{kind}/versions', {
              params: { path: { kind } },
              body: toSaveDraftBody(draft),
              signal,
            }),
            mapLegalDocumentVersion,
          ),
        invalidatesTags: (_result, error, { kind }) => (error ? [] : changed(kind)),
      }),
      updateLegalDocumentDraft: build.mutation<
        LegalDocumentVersion,
        { kind: LegalDocumentKind; id: number; draft: LegalDocumentDraft }
      >({
        queryFn: ({ id, draft }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/documents/versions/{id}', {
              params: { path: { id } },
              body: toSaveDraftBody(draft),
              signal,
            }),
            mapLegalDocumentVersion,
          ),
        invalidatesTags: (_result, error, { kind, id }) => (error ? [] : changed(kind, id)),
      }),
      publishLegalDocumentDraft: build.mutation<
        LegalDocumentVersion,
        { kind: LegalDocumentKind; id: number; effectiveFrom: string }
      >({
        queryFn: ({ id, effectiveFrom }, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/content/documents/versions/{id}/publish', {
              params: { path: { id } },
              body: { effectiveFrom },
              signal,
            }),
            mapLegalDocumentVersion,
          ),
        invalidatesTags: (_result, error, { kind, id }) => (error ? [] : changed(kind, id)),
      }),
      deleteLegalDocumentDraft: build.mutation<void, { kind: LegalDocumentKind; id: number }>({
        queryFn: ({ id }, { signal }) =>
          apiCall(
            apiClient.DELETE('/api/admin/content/documents/versions/{id}', {
              params: { path: { id } },
              signal,
            }),
          ),
        invalidatesTags: (_result, error, { kind, id }) => (error ? [] : changed(kind, id)),
      }),
    }),
  });

export const {
  useCreateLegalDocumentDraftMutation,
  useDeleteLegalDocumentDraftMutation,
  useGetLegalDocumentVersionQuery,
  useGetLegalDocumentVersionsQuery,
  useGetLegalDocumentsQuery,
  usePublishLegalDocumentDraftMutation,
  useUpdateLegalDocumentDraftMutation,
} = adminLegalDocumentsApi;
