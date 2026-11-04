import { baseApi } from '@admin/shared/api-client';

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

const folders = '/api/admin/media/folders';
const files = '/api/admin/media/files';

const fileForm = (file: Blob, folderId?: number | null) => {
  const form = new FormData();
  form.append('file', file);
  if (folderId != null) form.append('folderId', String(folderId));
  return form;
};

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
        query: () => ({ url: folders, method: 'GET' }),
        transformResponse: mapMediaFolderTree,
        providesTags: [{ type: 'MediaFolders', id: 'TREE' }],
      }),
      createMediaFolder: build.mutation<MediaFolder, { name: string; parentId: number | null }>({
        query: ({ name, parentId }) => ({
          url: folders,
          method: 'POST',
          data: toSaveFolderBody(name, parentId),
        }),
        transformResponse: mapMediaFolder,
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'MediaFolders', id: 'TREE' }]),
      }),
      updateMediaFolder: build.mutation<
        MediaFolder,
        { id: number; name: string; parentId: number | null }
      >({
        query: ({ id, name, parentId }) => ({
          url: `${folders}/${id}`,
          method: 'PUT',
          data: toSaveFolderBody(name, parentId),
        }),
        transformResponse: mapMediaFolder,
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'MediaFolders', id: 'TREE' }]),
      }),
      deleteMediaFolder: build.mutation<void, number>({
        query: (id) => ({ url: `${folders}/${id}`, method: 'DELETE' }),
        invalidatesTags: (_result, error) => (error ? [] : [{ type: 'MediaFolders', id: 'TREE' }]),
      }),
      getMediaFiles: build.query<MediaFilePage, MediaFilesQuery>({
        query: (query) => ({ url: files, method: 'GET', params: toMediaFilesParams(query) }),
        transformResponse: mapMediaFilePage,
        providesTags: [{ type: 'MediaFiles', id: 'LIST' }],
      }),
      uploadMediaFile: build.mutation<MediaFile, { file: Blob; folderId: number | null }>({
        query: ({ file, folderId }) => ({
          url: files,
          method: 'POST',
          data: fileForm(file, folderId),
        }),
        transformResponse: mapMediaFile,
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      replaceMediaFile: build.mutation<MediaFile, { id: number; file: Blob }>({
        query: ({ id, file }) => ({
          url: `${files}/${id}/content`,
          method: 'PUT',
          data: fileForm(file),
        }),
        transformResponse: mapMediaFile,
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      updateMediaFile: build.mutation<
        MediaFile,
        { id: number; fileName: string; folderId: number | null }
      >({
        query: ({ id, fileName, folderId }) => ({
          url: `${files}/${id}`,
          method: 'PUT',
          data: toUpdateFileBody(fileName, folderId),
        }),
        transformResponse: mapMediaFile,
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      moveMediaFiles: build.mutation<number, { fileIds: number[]; folderId: number | null }>({
        query: (body) => ({ url: `${files}/move`, method: 'POST', data: body }),
        transformResponse: (response: unknown) => moveMediaFilesResultSchema.parse(response).moved,
        invalidatesTags: (_result, error) => (error ? [] : libraryTags),
      }),
      deleteMediaFile: build.mutation<void, number>({
        query: (id) => ({ url: `${files}/${id}`, method: 'DELETE' }),
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
