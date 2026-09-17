import { CatalogList, CatalogListFooter, CatalogPageState } from '@mobile/catalog/ui';

import type { useCatalogController } from '../hooks/use-catalog-controller';
import type { CatalogProduct } from '@mobile/catalog/model';

type CatalogController = ReturnType<typeof useCatalogController> & {
  onProductPress: (product: CatalogProduct) => void;
};

export function CatalogResults({
  clearSearch,
  items,
  loadNextPage,
  onProductPress,
  queryResult,
  refresh,
  state,
}: Pick<
  CatalogController,
  'clearSearch' | 'items' | 'loadNextPage' | 'onProductPress' | 'queryResult' | 'refresh' | 'state'
>) {
  const { currentData, isError, isFetching, isLoading, refetch } = queryResult;
  const retry = () => void refetch();
  const visibleItems =
    items.length === 0 && state.query.page === 1 && currentData?.items.length
      ? currentData.items
      : items;
  if (isError && visibleItems.length === 0)
    return <CatalogPageState kind="error" onRetry={retry} />;
  if (visibleItems.length === 0 && (currentData === undefined || isLoading || isFetching))
    return <CatalogPageState kind="loading" />;
  if (!isFetching && currentData && visibleItems.length === 0)
    return state.query.search ? (
      <CatalogPageState
        actionAccessibilityLabel="Очистити пошук"
        actionLabel="Очистити пошук"
        kind="empty"
        onAction={clearSearch}
      />
    ) : (
      <CatalogPageState kind="empty" />
    );
  const footer = isError ? (
    <CatalogListFooter kind="retry" onPress={retry} />
  ) : currentData && currentData.pageNumber < currentData.totalPages ? (
    <CatalogListFooter isLoading={isFetching} kind="load_more" onPress={loadNextPage} />
  ) : null;
  return (
    <CatalogList
      footer={footer}
      items={visibleItems}
      onProductPress={onProductPress}
      onRefresh={refresh}
      refreshing={isFetching && state.query.page === 1}
    />
  );
}
