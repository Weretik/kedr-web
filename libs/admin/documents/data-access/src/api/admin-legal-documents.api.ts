import { baseApi } from '@admin/shared/api-client';

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

const root = '/api/admin/content/documents';
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
        query: () => ({ url: root, method: 'GET' }),
        transformResponse: mapLegalDocumentOverviews,
        providesTags: [{ type: tag, id: 'LIST' }],
      }),
      getLegalDocumentVersions: build.query<LegalDocumentVersionSummary[], LegalDocumentKind>({
        query: (kind) => ({ url: `${root}/${kind}/versions`, method: 'GET' }),
        transformResponse: mapLegalDocumentVersions,
        providesTags: (_result, _error, kind) => [{ type: tag, id: `versions:${kind}` }],
      }),
      getLegalDocumentVersion: build.query<LegalDocumentVersion, number>({
        query: (id) => ({ url: `${root}/versions/${id}`, method: 'GET' }),
        transformResponse: mapLegalDocumentVersion,
        providesTags: (_result, _error, id) => [{ type: tag, id }],
      }),
      createLegalDocumentDraft: build.mutation<
        LegalDocumentVersion,
        { kind: LegalDocumentKind; draft: LegalDocumentDraft }
      >({
        query: ({ kind, draft }) => ({
          url: `${root}/${kind}/versions`,
          method: 'POST',
          data: toSaveDraftBody(draft),
        }),
        transformResponse: mapLegalDocumentVersion,
        invalidatesTags: (_result, error, { kind }) => (error ? [] : changed(kind)),
      }),
      updateLegalDocumentDraft: build.mutation<
        LegalDocumentVersion,
        { kind: LegalDocumentKind; id: number; draft: LegalDocumentDraft }
      >({
        query: ({ id, draft }) => ({
          url: `${root}/versions/${id}`,
          method: 'PUT',
          data: toSaveDraftBody(draft),
        }),
        transformResponse: mapLegalDocumentVersion,
        invalidatesTags: (_result, error, { kind, id }) => (error ? [] : changed(kind, id)),
      }),
      publishLegalDocumentDraft: build.mutation<
        LegalDocumentVersion,
        { kind: LegalDocumentKind; id: number; effectiveFrom: string }
      >({
        query: ({ id, effectiveFrom }) => ({
          url: `${root}/versions/${id}/publish`,
          method: 'POST',
          data: { effectiveFrom },
        }),
        transformResponse: mapLegalDocumentVersion,
        invalidatesTags: (_result, error, { kind, id }) => (error ? [] : changed(kind, id)),
      }),
      deleteLegalDocumentDraft: build.mutation<void, { kind: LegalDocumentKind; id: number }>({
        query: ({ id }) => ({ url: `${root}/versions/${id}`, method: 'DELETE' }),
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
