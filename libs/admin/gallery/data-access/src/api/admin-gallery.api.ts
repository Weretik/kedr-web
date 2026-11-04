import { baseApi } from '@admin/shared/api-client';

import { mapGallery, mapYoutubePreview, toGalleryTextsBody } from '../mappers/gallery.mapper';

import type { GalleryItem, GalleryTexts, YoutubePreview } from '@admin/gallery/model';

const root = '/api/admin/content/gallery';
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
        query: () => ({ url: root, method: 'GET' }),
        transformResponse: mapGallery,
        providesTags: [{ type: tag, id: 'LIST' }],
      }),
      previewYoutubeVideo: build.query<YoutubePreview, string>({
        query: (url) => ({ url: `${root}/youtube-preview`, method: 'GET', params: { url } }),
        transformResponse: mapYoutubePreview,
      }),
      addGalleryPhotos: build.mutation<GalleryItem[], readonly number[]>({
        query: (mediaFileIds) => ({
          url: `${root}/photos`,
          method: 'POST',
          data: { mediaFileIds: [...mediaFileIds] },
        }),
        transformResponse: mapGallery,
        onQueryStarted: replaceList,
      }),
      addGalleryVideo: build.mutation<GalleryItem[], { url: string; texts: GalleryTexts }>({
        query: ({ url, texts }) => ({
          url: `${root}/videos`,
          method: 'POST',
          data: { url, ...toGalleryTextsBody(texts) },
        }),
        transformResponse: mapGallery,
        onQueryStarted: replaceList,
      }),
      updateGalleryItem: build.mutation<GalleryItem[], { id: number; texts: GalleryTexts }>({
        query: ({ id, texts }) => ({
          url: `${root}/items/${id}`,
          method: 'PUT',
          data: toGalleryTextsBody(texts),
        }),
        transformResponse: mapGallery,
        onQueryStarted: replaceList,
      }),
      deleteGalleryItem: build.mutation<GalleryItem[], number>({
        query: (id) => ({ url: `${root}/items/${id}`, method: 'DELETE' }),
        transformResponse: mapGallery,
        onQueryStarted: replaceList,
      }),
      /** Moves the cards on screen at once and rolls back if the server refuses the order. */
      reorderGallery: build.mutation<GalleryItem[], readonly number[]>({
        query: (ids) => ({ url: `${root}/order`, method: 'PUT', data: { ids: [...ids] } }),
        transformResponse: mapGallery,
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
