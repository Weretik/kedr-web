import { baseApi } from '@admin/shared/api-client';

import { mapHomeBlocks, toHomeBrandBody, toHomeFaqBody } from '../mappers/home-content.mapper';

import type {
  HomeBlocks,
  HomeBrandDraft,
  HomeBrandLogo,
  HomeFaqTexts,
} from '@admin/home-content/model';

const root = '/api/admin/content/home';
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
          query: (ids) => ({
            url: `${root}/${list}/order`,
            method: 'PUT',
            data: { ids: [...ids] },
          }),
          transformResponse: mapHomeBlocks,
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
          query: () => ({ url: root, method: 'GET' }),
          transformResponse: mapHomeBlocks,
          providesTags: [{ type: tag, id: 'BLOCKS' }],
        }),
        createHomeFaqItem: build.mutation<HomeBlocks, HomeFaqTexts>({
          query: (texts) => ({ url: `${root}/faq`, method: 'POST', data: toHomeFaqBody(texts) }),
          transformResponse: mapHomeBlocks,
          onQueryStarted: replaceBlocks,
        }),
        updateHomeFaqItem: build.mutation<HomeBlocks, { id: number; texts: HomeFaqTexts }>({
          query: ({ id, texts }) => ({
            url: `${root}/faq/${id}`,
            method: 'PUT',
            data: toHomeFaqBody(texts),
          }),
          transformResponse: mapHomeBlocks,
          onQueryStarted: replaceBlocks,
        }),
        deleteHomeFaqItem: build.mutation<HomeBlocks, number>({
          query: (id) => ({ url: `${root}/faq/${id}`, method: 'DELETE' }),
          transformResponse: mapHomeBlocks,
          onQueryStarted: replaceBlocks,
        }),
        reorderHomeFaq: reorder('faq'),
        createHomeBrand: build.mutation<HomeBlocks, BrandDraft>({
          query: (draft) => ({
            url: `${root}/brands`,
            method: 'POST',
            data: toHomeBrandBody(draft),
          }),
          transformResponse: mapHomeBlocks,
          onQueryStarted: replaceBlocks,
        }),
        updateHomeBrand: build.mutation<HomeBlocks, { id: number; draft: BrandDraft }>({
          query: ({ id, draft }) => ({
            url: `${root}/brands/${id}`,
            method: 'PUT',
            data: toHomeBrandBody(draft),
          }),
          transformResponse: mapHomeBlocks,
          onQueryStarted: replaceBlocks,
        }),
        deleteHomeBrand: build.mutation<HomeBlocks, number>({
          query: (id) => ({ url: `${root}/brands/${id}`, method: 'DELETE' }),
          transformResponse: mapHomeBlocks,
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
