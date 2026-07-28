import { useGetProductsListQuery } from '@admin/products/data-access';
import { ProductsDataGrid } from '@admin/products/ui';
import { Stack, Typography } from '@mui/material';
import { useMemo, useRef } from 'react';

import { ProductsListFilters } from '../components/products-list-filters';
import { ProductsPageToolbar } from '../components/products-page-toolbar';
import { useProductsListState } from '../hooks/use-products-list-state';

export function ProductsPage() {
  const productsListState = useProductsListState();
  const productsQuery = useGetProductsListQuery(productsListState.appliedQuery);
  const rowCountReference = useRef(0);
  const rowCount = useMemo(() => {
    if (productsQuery.data?.totalRecords !== undefined) {
      rowCountReference.current = productsQuery.data.totalRecords;
    }

    return rowCountReference.current;
  }, [productsQuery.data?.totalRecords]);

  return (
    <Stack component="section" spacing={3}>
      <ProductsPageToolbar>
        <ProductsListFilters
          canReset={productsListState.canReset}
          onApplyPriceRange={productsListState.applyPriceRange}
          onApplySearch={productsListState.applySearch}
          onFilterChange={productsListState.setFilter}
          onInStockChange={productsListState.setInStock}
          onPriceFromDraftChange={productsListState.setPriceFromDraft}
          onPriceToDraftChange={productsListState.setPriceToDraft}
          onReset={productsListState.reset}
          onSearchDraftChange={productsListState.setSearchDraft}
          priceFromDraft={productsListState.priceFromDraft}
          priceRangeError={productsListState.priceRangeError}
          priceToDraft={productsListState.priceToDraft}
          query={productsListState.appliedQuery}
          searchDraft={productsListState.searchDraft}
        />
      </ProductsPageToolbar>
      <ProductsDataGrid
        errorMessage={getQueryErrorMessage(productsQuery.error)}
        loading={productsQuery.isLoading || productsQuery.isFetching}
        onPageChange={productsListState.setPage}
        onPageSizeChange={productsListState.setPageSize}
        onRetry={productsQuery.refetch}
        onSortChange={productsListState.setSort}
        page={productsListState.appliedQuery.page - 1}
        pageSize={productsListState.appliedQuery.pageSize}
        rowCount={rowCount}
        rows={productsQuery.data?.items ?? []}
        sort={productsListState.appliedQuery.sort}
      />
      <Typography color="text.secondary" variant="body2">
        Показано {productsQuery.data?.items.length ?? 0} з {rowCount} товарів
      </Typography>
    </Stack>
  );
}

export default ProductsPage;

function getQueryErrorMessage(error: unknown): string | undefined {
  if (typeof error !== 'object' || error === null || !('message' in error)) {
    return undefined;
  }

  return typeof error.message === 'string' ? error.message : undefined;
}
