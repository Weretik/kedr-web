import { apiCall, apiClient, baseApi, formDataBody } from '@admin/shared/api-client';

import {
  mapMediaFile,
  mapMediaFilePage,
  mapMediaFolder,
  mapMediaFolderTree,
  toMediaFilesParams,
  toSaveFolderBody,
  toUpdateFileBody,
} from '../mappers/media.mapper';
import { moveMediaFilesResultSchema } from '../validators/media.schemas';

import type {
  MediaFile,
  MediaFilePage,
  MediaFilesQuery,
  MediaFolder,
  MediaFolderTree,
} from '@admin/media/model';

/** Any file change can change folder counts, so both lists refresh. */
const libraryTags = [
  { type: 'MediaFolders' as const, id: 'TREE' },
  { type: 'MediaFiles' as const, id: 'LIST' },
];

export const adminMediaApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['MediaFolders', 'MediaFiles'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getMediaFolders: build.query<MediaFolderTree, void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/media/folders', { signal }), mapMediaFolderTree),
        providesTags: [{ type: 'MediaFolders', id: 'TREE' }],
      }),
      createMediaFolder: build.mutation<MediaFolder, { name: string; parentId: number | null }>({
        queryFn: ({ name, parentId }, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/media/folders', {
              body: toSaveFolderBody(name, parentId),
              signal,
            }),
            mapMediaFolder,
          ),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'MediaFolders', id: 'TREE' }]),
      }),
      updateMediaFolder: build.mutation<
        MediaFolder,
        { id: number; name: string; parentId: number | null }
      >({
        queryFn: ({ id, name, parentId }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/media/folders/{id}', {
              params: { path: { id } },
              body: toSaveFolderBody(name, parentId),
              signal,
            }),
            mapMediaFolder,
          ),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'MediaFolders', id: 'TREE' }]),
      }),
      deleteMediaFolder: build.mutation<void, number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.DELETE('/api/admin/media/folders/{id}', { params: { path: { id } }, signal }),
          ),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'MediaFolders', id: 'TREE' }]),
      }),
      getMediaFiles: build.query<MediaFilePage, MediaFilesQuery>({
        queryFn: (query, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/media/files', {
              params: { query: toMediaFilesParams(query) },
              signal,
            }),
            mapMediaFilePage,
          ),
        providesTags: [{ type: 'MediaFiles', id: 'LIST' }],
      }),
      uploadMediaFile: build.mutation<MediaFile, { file: Blob; folderId: number | null }>({
        queryFn: ({ file, folderId }, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/media/files', {
              ...formDataBody({ file, folderId }),
              signal,
            }),
            mapMediaFile,
          ),
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      replaceMediaFile: build.mutation<MediaFile, { id: number; file: Blob }>({
        queryFn: ({ id, file }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/media/files/{id}/content', {
              params: { path: { id } },
              ...formDataBody({ file }),
              signal,
            }),
            mapMediaFile,
          ),
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      updateMediaFile: build.mutation<
        MediaFile,
        { id: number; fileName: string; folderId: number | null }
      >({
        queryFn: ({ id, fileName, folderId }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/media/files/{id}', {
              params: { path: { id } },
              body: toUpdateFileBody(fileName, folderId),
              signal,
            }),
            mapMediaFile,
          ),
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      moveMediaFiles: build.mutation<number, { fileIds: number[]; folderId: number | null }>({
        queryFn: (body, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/media/files/move', { body: body, signal }),
            (response: unknown) => moveMediaFilesResultSchema.parse(response).moved,
          ),
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      deleteMediaFile: build.mutation<void, number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.DELETE('/api/admin/media/files/{id}', { params: { path: { id } }, signal }),
          ),
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
    }),
  });

export const {
  useCreateMediaFolderMutation,
  useDeleteMediaFileMutation,
  useDeleteMediaFolderMutation,
  useGetMediaFilesQuery,
  useGetMediaFoldersQuery,
  useMoveMediaFilesMutation,
  useReplaceMediaFileMutation,
  useUpdateMediaFileMutation,
  useUpdateMediaFolderMutation,
  useUploadMediaFileMutation,
} = adminMediaApi;
