import { useGetMissingPhotoProductsQuery } from '@mobile/catalog/data-access';
import { useCallback, useState } from 'react';

export function useMissingPhotoProductsController() {
  const [page, setPage] = useState(1);
  const queryResult = useGetMissingPhotoProductsQuery({ page });
  const { data, isFetching, refetch } = queryResult;

  const loadNextPage = useCallback(() => {
    if (data && !isFetching && data.pageNumber < data.totalPages) {
      setPage(data.pageNumber + 1);
    }
  }, [data, isFetching]);

  const refresh = useCallback(() => {
    if (page === 1) void refetch();
    else setPage(1);
  }, [page, refetch]);

  const retry = useCallback(() => {
    void refetch();
  }, [refetch]);

  return {
    items: data?.items ?? [],
    loadNextPage,
    page,
    queryResult,
    refresh,
    retry,
  };
}
