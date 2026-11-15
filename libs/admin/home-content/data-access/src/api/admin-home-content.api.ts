import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import { mapHomeBlocks, toHomeBrandBody, toHomeFaqBody } from '../mappers/home-content.mapper';

import type {
  HomeBlocks,
  HomeBrandDraft,
  HomeBrandLogo,
  HomeFaqTexts,
} from '@admin/home-content/model';

const tag = 'HomeContent' as const;

type BrandDraft = HomeBrandDraft & { logo: HomeBrandLogo };
type List = 'faq' | 'brands';

export const adminHomeContentApi = baseApi
  .enhanceEndpoints({ addTagTypes: [tag] })
  .injectEndpoints({
    endpoints: (build) => {
      /** Every change answers with both lists; they replace the cached ones without a refetch. */
      const replaceBlocks = async (
        _arg: unknown,
        {
          dispatch,
          queryFulfilled,
        }: {
          dispatch: (action: unknown) => unknown;
          queryFulfilled: Promise<{ data: HomeBlocks }>;
        },
      ) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(adminHomeContentApi.util.upsertQueryData('getHomeBlocks', undefined, data));
        } catch {
          // The page shows the error; the cached lists stay as they were.
        }
      };

      /** Moves the rows on screen at once and rolls back if the server refuses the order. */
      const reorder = (list: List) =>
        build.mutation<HomeBlocks, readonly number[]>({
          queryFn: (ids, { signal }) => {
            const init = { body: { ids: [...ids] }, signal };
            return apiCall(
              list === 'faq'
                ? apiClient.PUT('/api/admin/content/home/faq/order', init)
                : apiClient.PUT('/api/admin/content/home/brands/order', init),
              mapHomeBlocks,
            );
          },
          async onQueryStarted(ids, { dispatch, queryFulfilled }) {
            const patch = dispatch(
              adminHomeContentApi.util.updateQueryData('getHomeBlocks', undefined, (draft) => {
                const rows: { id: number }[] = draft[list];
                const byId = new Map(rows.map((row) => [row.id, row]));
                const ordered = ids.flatMap((id) => byId.get(id) ?? []);
                if (ordered.length === rows.length) rows.splice(0, rows.length, ...ordered);
              }),
            );
            try {
              const { data } = await queryFulfilled;
              dispatch(adminHomeContentApi.util.upsertQueryData('getHomeBlocks', undefined, data));
            } catch {
              patch.undo();
            }
          },
        });

      return {
        getHomeBlocks: build.query<HomeBlocks, void>({
          queryFn: (_arg, { signal }) =>
            apiCall(apiClient.GET('/api/admin/content/home', { signal }), mapHomeBlocks),
          providesTags: [{ type: tag, id: 'BLOCKS' }],
        }),
        createHomeFaqItem: build.mutation<HomeBlocks, HomeFaqTexts>({
          queryFn: (texts, { signal }) =>
            apiCall(
              apiClient.POST('/api/admin/content/home/faq', { body: toHomeFaqBody(texts), signal }),
              mapHomeBlocks,
            ),
          onQueryStarted: replaceBlocks,
        }),
        updateHomeFaqItem: build.mutation<HomeBlocks, { id: number; texts: HomeFaqTexts }>({
          queryFn: ({ id, texts }, { signal }) =>
            apiCall(
              apiClient.PUT('/api/admin/content/home/faq/{id}', {
                params: { path: { id } },
                body: toHomeFaqBody(texts),
                signal,
              }),
              mapHomeBlocks,
            ),
          onQueryStarted: replaceBlocks,
        }),
        deleteHomeFaqItem: build.mutation<HomeBlocks, number>({
          queryFn: (id, { signal }) =>
            apiCall(
              apiClient.DELETE('/api/admin/content/home/faq/{id}', {
                params: { path: { id } },
                signal,
              }),
              mapHomeBlocks,
            ),
          onQueryStarted: replaceBlocks,
        }),
        reorderHomeFaq: reorder('faq'),
        createHomeBrand: build.mutation<HomeBlocks, BrandDraft>({
          queryFn: (draft, { signal }) =>
            apiCall(
              apiClient.POST('/api/admin/content/home/brands', {
                body: toHomeBrandBody(draft),
                signal,
              }),
              mapHomeBlocks,
            ),
          onQueryStarted: replaceBlocks,
        }),
        updateHomeBrand: build.mutation<HomeBlocks, { id: number; draft: BrandDraft }>({
          queryFn: ({ id, draft }, { signal }) =>
            apiCall(
              apiClient.PUT('/api/admin/content/home/brands/{id}', {
                params: { path: { id } },
                body: toHomeBrandBody(draft),
                signal,
              }),
              mapHomeBlocks,
            ),
          onQueryStarted: replaceBlocks,
        }),
        deleteHomeBrand: build.mutation<HomeBlocks, number>({
          queryFn: (id, { signal }) =>
            apiCall(
              apiClient.DELETE('/api/admin/content/home/brands/{id}', {
                params: { path: { id } },
                signal,
              }),
              mapHomeBlocks,
            ),
          onQueryStarted: replaceBlocks,
        }),
        reorderHomeBrands: reorder('brands'),
      };
    },
  });

export const {
  useCreateHomeBrandMutation,
  useCreateHomeFaqItemMutation,
  useDeleteHomeBrandMutation,
  useDeleteHomeFaqItemMutation,
  useGetHomeBlocksQuery,
  useReorderHomeBrandsMutation,
  useReorderHomeFaqMutation,
  useUpdateHomeBrandMutation,
  useUpdateHomeFaqItemMutation,
} = adminHomeContentApi;
