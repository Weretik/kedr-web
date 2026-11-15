import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapGallery, mapYoutubePreview, toGalleryTextsBody } from '../mappers/gallery.mapper';

import type { GalleryItem, GalleryTexts, YoutubePreview } from '@admin/gallery/model';

const tag = 'Gallery' as const;

export const adminGalleryApi = baseApi.enhanceEndpoints({ addTagTypes: [tag] }).injectEndpoints({
  endpoints: (build) => {
    /** Every change answers with the whole gallery; it replaces the cached list without a refetch. */
    const replaceList = async (
      _arg: unknown,
      {
        dispatch,
        queryFulfilled,
      }: {
        dispatch: (action: unknown) => unknown;
        queryFulfilled: Promise<{ data: GalleryItem[] }>;
      },
    ) => {
      try {
        const { data } = await queryFulfilled;
        dispatch(adminGalleryApi.util.upsertQueryData('getGallery', undefined, data));
      } catch {
        // The page shows the error; the cached list stays as it was.
      }
    };

    return {
      getGallery: build.query<GalleryItem[], void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/content/gallery', { signal }), mapGallery),
        providesTags: [{ type: tag, id: 'LIST' }],
      }),
      previewYoutubeVideo: build.query<YoutubePreview, string>({
        queryFn: (url, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/content/gallery/youtube-preview', {
              params: { query: { url } },
              signal,
            }),
            mapYoutubePreview,
          ),
      }),
      addGalleryPhotos: build.mutation<GalleryItem[], readonly number[]>({
        queryFn: (mediaFileIds, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/content/gallery/photos', {
              body: { mediaFileIds: [...mediaFileIds] },
              signal,
            }),
            mapGallery,
          ),
        onQueryStarted: replaceList,
      }),
      addGalleryVideo: build.mutation<GalleryItem[], { url: string; texts: GalleryTexts }>({
        queryFn: ({ url, texts }, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/content/gallery/videos', {
              body: { url, ...toGalleryTextsBody(texts) },
              signal,
            }),
            mapGallery,
          ),
        onQueryStarted: replaceList,
      }),
      updateGalleryItem: build.mutation<GalleryItem[], { id: number; texts: GalleryTexts }>({
        queryFn: ({ id, texts }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/gallery/items/{id}', {
              params: { path: { id } },
              body: toGalleryTextsBody(texts),
              signal,
            }),
            mapGallery,
          ),
        onQueryStarted: replaceList,
      }),
      deleteGalleryItem: build.mutation<GalleryItem[], number>({
        queryFn: (id, { signal }) =>
          apiCall(
            apiClient.DELETE('/api/admin/content/gallery/items/{id}', {
              params: { path: { id } },
              signal,
            }),
            mapGallery,
          ),
        onQueryStarted: replaceList,
      }),
      /** Moves the cards on screen at once and rolls back if the server refuses the order. */
      reorderGallery: build.mutation<GalleryItem[], readonly number[]>({
        queryFn: (ids, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/content/gallery/order', { body: { ids: [...ids] }, signal }),
            mapGallery,
          ),
        async onQueryStarted(ids, { dispatch, queryFulfilled }) {
          const patch = dispatch(
            adminGalleryApi.util.updateQueryData('getGallery', undefined, (draft) => {
              const byId = new Map(draft.map((item) => [item.id, item]));
              const ordered = ids.flatMap((id) => byId.get(id) ?? []);
              if (ordered.length === draft.length) draft.splice(0, draft.length, ...ordered);
            }),
          );
          try {
            const { data } = await queryFulfilled;
            dispatch(adminGalleryApi.util.upsertQueryData('getGallery', undefined, data));
          } catch {
            patch.undo();
          }
        },
      }),
    };
  },
});

export const {
  useAddGalleryPhotosMutation,
  useAddGalleryVideoMutation,
  useDeleteGalleryItemMutation,
  useGetGalleryQuery,
  useLazyPreviewYoutubeVideoQuery,
  useReorderGalleryMutation,
  useUpdateGalleryItemMutation,
} = adminGalleryApi;
