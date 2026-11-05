import { ProductsDataGrid } from '@admin/products/ui';
import { NoticeSnackbar } from '@admin/shared/ui';
import { Alert, Card, Stack, Tab, Tabs } from '@mui/material';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DeletedProductsPanel } from '../components/deleted-products-panel';
import { ProductEditPanel } from '../components/product-edit-panel';
import { ProductsPageToolbar } from '../components/products-page-toolbar';
import { useProductsListData } from '../hooks/use-products-list-data';
import { useProductsListState } from '../hooks/use-products-list-state';
import { addProductFeedback } from '../model/add-product-feedback';
import { toProductsGridFilterModel } from '../model/products-grid-filters';

import type { EditedProduct } from '../components/product-edit-panel';
import type { AddProductFeedback } from '../model/add-product-feedback';
import type { ProductsListMode } from '../model/products-url-state';
import type { AddProductResult } from '../products.routes';
import type { AdminProductListItem } from '@admin/products/model';

const emptyMessages: Partial<Record<ProductsListMode, string>> = {
  missing: 'Товарів без фото немає.',
  site: 'Товарів на сайті немає.',
};

export function ProductsPage({
  canEditSlug = false,
  canSeeDeleted = false,
  onAddProduct,
}: {
  canEditSlug?: boolean;
  canSeeDeleted?: boolean;
  onAddProduct?: (productId: number) => AddProductResult;
}) {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<AddProductFeedback | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  // The last edited product stays set after closing so its panel can reopen without a reload.
  const [editedProduct, setEditedProduct] = useState<EditedProduct | undefined>();
  const [editOpen, setEditOpen] = useState(false);
  const list = useProductsListState(canSeeDeleted);
  const { activeQuery, categoriesQuery, problemReasonsQuery, rowCount } = useProductsListData(
    list.mode,
    list.urlState,
  );
  const { currentQuery, mode, search } = list;

  const viewProduct = useCallback(
    (product: AdminProductListItem) => {
      if (!product.productSlug.trim()) return;
      navigate(`/catalog/${encodeURIComponent(product.productSlug)}${search ? `?${search}` : ''}`);
    },
    [navigate, search],
  );
  const editProduct = useCallback((product: AdminProductListItem) => {
    setEditedProduct({
      id: product.id,
      nameUk: product.nameUk,
      productSlug: product.productSlug,
      categoryId: product.categoryId,
    });
    setEditOpen(true);
  }, []);

  return (
    <Stack component="section" spacing={3}>
      <ProductsPageToolbar />
      {feedback && (
        <Alert onClose={() => setFeedback(null)} severity={feedback.severity}>
          {feedback.message}
        </Alert>
      )}
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <Tabs
          aria-label="Режим списку товарів"
          onChange={(_event, value: ProductsListMode) => list.changeMode(value)}
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
            onQueryChange={list.changeDeletedQuery}
            query={list.urlState.deletedQuery}
          />
        ) : (
          <ProductsDataGrid
            categories={categoriesQuery.data ?? []}
            categoryId={currentQuery.categoryId}
            categoriesLoading={categoriesQuery.isFetching}
            categoriesError={categoriesQuery.isError}
            booleanFilters={currentQuery}
            filterModel={toProductsGridFilterModel(currentQuery, mode === 'missing')}
            emptyMessage={emptyMessages[mode]}
            errorMessage={activeQuery.isError ? 'Не вдалося завантажити товари.' : undefined}
            loading={activeQuery.isLoading || activeQuery.isFetching}
            onFilterChange={list.changeFilters}
            onBooleanFilterChange={list.changeBooleanFilter}
            onCategoryChange={list.changeCategory}
            onPageChange={list.changePage}
            onPageSizeChange={list.changePageSize}
            onRetry={activeQuery.refetch}
            onSortChange={list.changeSort}
            onEditProduct={editProduct}
            onViewProduct={viewProduct}
            onAddProduct={
              onAddProduct
                ? (product) => setFeedback(addProductFeedback(onAddProduct(product.id)))
                : undefined
            }
            page={currentQuery.page - 1}
            pageSize={currentQuery.pageSize}
            priceFilterable={mode !== 'missing'}
            rowCount={rowCount}
            rows={activeQuery.data?.items ?? []}
            sort={currentQuery.sort}
            showGroup={mode === 'site'}
            problemFilter={
              mode === 'site'
                ? {
                    problemsOnly: currentQuery.problemsOnly === true,
                    reason: currentQuery.problemReason,
                    reasons: problemReasonsQuery.data ?? [],
                    onChange: list.changeProblemFilter,
                  }
                : undefined
            }
          />
        )}
      </Card>
      <ProductEditPanel
        canEditSlug={canEditSlug}
        onClose={() => setEditOpen(false)}
        onSlugChanged={(slug) => {
          setEditedProduct((current) => current && { ...current, productSlug: slug });
          setNotice(`Нова адреса: ${slug}`);
        }}
        open={editOpen}
        product={editedProduct}
      />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default ProductsPage;
