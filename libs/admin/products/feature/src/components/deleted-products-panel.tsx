import { useGetProductsListQuery } from '@admin/products/data-access';
import { DeletedProductsDataGrid } from '@admin/products/ui';

import type { ProductsListQuery } from '@admin/products/model';

interface DeletedProductsPanelProps {
  query: ProductsListQuery;
  onQueryChange: (query: ProductsListQuery) => void;
}

/** «Видалені» tab of the products list (administrators only). */
export function DeletedProductsPanel({ onQueryChange, query }: DeletedProductsPanelProps) {
  const result = useGetProductsListQuery({ ...query, deleted: true });

  return (
    <DeletedProductsDataGrid
      errorMessage={result.isError ? 'Не вдалося завантажити видалені товари.' : undefined}
      loading={result.isFetching}
      onPageChange={(page) => onQueryChange({ ...query, page })}
      onPageSizeChange={(pageSize) => onQueryChange({ ...query, page: 1, pageSize })}
      onRetry={() => result.refetch()}
      onSearchChange={(searchTerm) => onQueryChange({ ...query, page: 1, searchTerm })}
      page={query.page - 1}
      pageSize={query.pageSize}
      rowCount={result.data?.totalRecords ?? 0}
      rows={result.data?.items ?? []}
      searchTerm={query.searchTerm}
    />
  );
}
