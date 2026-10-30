import {
  useGetAdminProductCategoriesQuery,
  useGetMissingPhotoProductsQuery,
  useGetProductsListQuery,
} from '@admin/products/data-access';
import { ProductsDataGrid } from '@admin/products/ui';
import { Alert, Card, Stack, Tab, Tabs } from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { DeletedProductsPanel } from '../components/deleted-products-panel';
import { ProductsPageToolbar } from '../components/products-page-toolbar';
import {
  fromProductsGridFilterModel,
  toProductsGridFilterModel,
} from '../hooks/products-grid-filters';
import { readProductsUrlState, writeProductsUrlState } from '../hooks/products-url-state';

import type { ProductsListMode } from '../hooks/products-url-state';
import type { AddProductResult } from '../products.routes';
import type { AdminProductListItem, ProductsListSort } from '@admin/products/model';
import type { GridFilterModel } from '@mui/x-data-grid';

type BooleanFilterField = 'inStock' | 'isSale' | 'isNew';

export function ProductsPage({
  canSeeDeleted = false,
  onAddProduct,
}: {
  canSeeDeleted?: boolean;
  onAddProduct?: (productId: number) => AddProductResult;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [addFeedback, setAddFeedback] = useState<{
    message: string;
    severity: 'info' | 'warning';
  } | null>(null);
  const navigate = useNavigate();
  const urlState = useMemo(() => readProductsUrlState(searchParams), [searchParams]);
  // The «Видалені» tab exists for administrators only.
  const mode = urlState.mode === 'deleted' && !canSeeDeleted ? 'all' : urlState.mode;
  const currentQuery =
    mode === 'missing'
      ? urlState.missingQuery
      : mode === 'site'
        ? urlState.siteQuery
        : urlState.allQuery;
  const productsQuery = useGetProductsListQuery(urlState.allQuery, { skip: mode !== 'all' });
  const siteQuery = useGetProductsListQuery(
    { ...urlState.siteQuery, exportToSite: true },
    { skip: mode !== 'site' },
  );
  const missingQuery = useGetMissingPhotoProductsQuery(urlState.missingQuery, {
    skip: mode !== 'missing',
  });
  const categoriesQuery = useGetAdminProductCategoriesQuery();
  const activeQuery =
    mode === 'missing' ? missingQuery : mode === 'site' ? siteQuery : productsQuery;
  const allRowCountReference = useRef(0);
  const missingRowCountReference = useRef(0);
  const siteRowCountReference = useRef(0);

  const changeMode = (nextMode: ProductsListMode) => {
    const nextQuery = urlState[queryKey(nextMode)];
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        mode: nextMode,
        [queryKey(nextMode)]: { ...nextQuery, page: 1 },
      }),
    );
  };

  const changePage = (page: number) =>
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        [queryKey(mode)]: { ...currentQuery, page },
      }),
    );
  const changePageSize = (pageSize: number) =>
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        [queryKey(mode)]: { ...currentQuery, page: 1, pageSize },
      }),
    );
  const changeSort = (sort: ProductsListSort) =>
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        [queryKey(mode)]: { ...currentQuery, page: 1, sort },
      }),
    );
  const changeFilters = (model: GridFilterModel) => {
    const filters = fromProductsGridFilterModel(model, mode === 'missing');
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        [queryKey(mode)]: { ...currentQuery, ...filters, page: 1 },
      }),
    );
  };
  const changeBooleanFilter = (field: BooleanFilterField, value: boolean | undefined) => {
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        [queryKey(mode)]: { ...currentQuery, [field]: value, page: 1 },
      }),
    );
  };
  const changeCategory = (categoryId: number | undefined) =>
    setSearchParams(
      writeProductsUrlState({
        ...urlState,
        [queryKey(mode)]: { ...currentQuery, categoryId, page: 1 },
      }),
    );

  const viewProduct = useCallback(
    (product: AdminProductListItem) => {
      if (!product.productSlug.trim()) return;
      navigate(
        `/catalog/${encodeURIComponent(product.productSlug)}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`,
      );
    },
    [navigate, searchParams],
  );

  const rowCount = useMemo(() => {
    const reference =
      mode === 'missing'
        ? missingRowCountReference
        : mode === 'site'
          ? siteRowCountReference
          : allRowCountReference;
    if (activeQuery.data?.totalRecords !== undefined) {
      reference.current = activeQuery.data.totalRecords;
    }

    return reference.current;
  }, [activeQuery.data?.totalRecords, mode]);

  return (
    <Stack component="section" spacing={3}>
      <ProductsPageToolbar />
      {addFeedback && (
        <Alert onClose={() => setAddFeedback(null)} severity={addFeedback.severity}>
          {addFeedback.message}
        </Alert>
      )}
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <Tabs
          aria-label="Режим списку товарів"
          onChange={(_event, value: ProductsListMode) => changeMode(value)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 3 } }}
          value={mode}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Усі товари" value="all" />
          <Tab label="Без фото" value="missing" />
          <Tab label="На сайті" value="site" />
          {canSeeDeleted ? <Tab label="Видалені" value="deleted" /> : null}
        </Tabs>
        {mode === 'deleted' ? (
          <DeletedProductsPanel
            onQueryChange={(deletedQuery) =>
              setSearchParams(writeProductsUrlState({ ...urlState, deletedQuery }))
            }
            query={urlState.deletedQuery}
          />
        ) : (
          <ProductsDataGrid
            categories={categoriesQuery.data ?? []}
            categoryId={currentQuery.categoryId}
            categoriesLoading={categoriesQuery.isFetching}
            categoriesError={categoriesQuery.isError}
            booleanFilters={currentQuery}
            filterModel={toProductsGridFilterModel(currentQuery, mode === 'missing')}
            emptyMessage={
              mode === 'missing'
                ? 'Товарів без фото немає.'
                : mode === 'site'
                  ? 'Товарів на сайті немає.'
                  : undefined
            }
            errorMessage={activeQuery.isError ? 'Не вдалося завантажити товари.' : undefined}
            loading={activeQuery.isLoading || activeQuery.isFetching}
            onFilterChange={changeFilters}
            onBooleanFilterChange={changeBooleanFilter}
            onCategoryChange={changeCategory}
            onPageChange={changePage}
            onPageSizeChange={changePageSize}
            onRetry={activeQuery.refetch}
            onSortChange={changeSort}
            onViewProduct={viewProduct}
            onAddProduct={
              onAddProduct
                ? (product) => {
                    const result = onAddProduct(product.id);
                    setAddFeedback(
                      result === 'saved'
                        ? {
                            message: 'Товар додано до поточного набору замовлення.',
                            severity: 'info',
                          }
                        : result === 'volatile'
                          ? {
                              message:
                                'Товар додано лише в цій вкладці. Браузер не зберіг набір; після закриття вкладки зміни можуть зникнути.',
                              severity: 'warning',
                            }
                          : {
                              message:
                                'Не вдалося додати товар. Перевірте ліміт позицій і кількість.',
                              severity: 'warning',
                            },
                    );
                  }
                : undefined
            }
            page={currentQuery.page - 1}
            pageSize={currentQuery.pageSize}
            priceFilterable={mode !== 'missing'}
            rowCount={rowCount}
            rows={activeQuery.data?.items ?? []}
            sort={currentQuery.sort}
          />
        )}
      </Card>
    </Stack>
  );
}

function queryKey(
  mode: ProductsListMode,
): 'allQuery' | 'missingQuery' | 'siteQuery' | 'deletedQuery' {
  return mode === 'missing'
    ? 'missingQuery'
    : mode === 'site'
      ? 'siteQuery'
      : mode === 'deleted'
        ? 'deletedQuery'
        : 'allQuery';
}

export default ProductsPage;
