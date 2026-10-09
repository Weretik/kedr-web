import { CatalogList, CatalogListFooter, MissingPhotoProductsState } from '@mobile/catalog/ui';

import type { MissingPhotoProductsController } from './missing-photo-products-content';

export function MissingPhotoProductsResults({
  items,
  loadNextPage,
  onProductPress,
  page,
  queryResult,
  refresh,
  retry,
}: Readonly<MissingPhotoProductsController>) {
  const { data, isError, isFetching, isLoading } = queryResult;

  if (isError && items.length === 0) {
    return <MissingPhotoProductsState kind="error" onRetry={retry} />;
  }

  if (items.length === 0 && (data === undefined || isLoading || isFetching)) {
    return <MissingPhotoProductsState kind="loading" />;
  }

  if (!isFetching && data && items.length === 0) {
    return <MissingPhotoProductsState kind="empty" />;
  }

  const footer = isError ? (
    <CatalogListFooter kind="retry" onPress={retry} />
  ) : data && data.pageNumber < data.totalPages ? (
    <CatalogListFooter isLoading={isFetching} kind="load_more" onPress={loadNextPage} />
  ) : null;

  return (
    <CatalogList
      footer={footer}
      items={items}
      onProductPress={onProductPress}
      onRefresh={refresh}
      refreshing={isFetching && page === 1 && items.length > 0}
    />
  );
}
