import { productListSummary, type PricedProduct } from '@mobile/catalog/model';
import { ProductRow } from '@mobile/catalog/ui';
import { AppText, createStyles, StateView, useStyles } from '@mobile/shared/ui';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useCallback, useLayoutEffect, useRef } from 'react';
import { View } from 'react-native';

import { ProductCategoryChips } from './product-category-chips';
import { ProductListToolbar } from './product-list-toolbar';
import { useProductList } from '../hooks/use-product-list';

export interface ProductListProps {
  counterpartyId: string | null;
  isOnline: boolean | null;
  onOpen: (productId: number) => void;
  /** «+» on each row: adds the product to the calculation (R-009). */
  onAdd?: (product: PricedProduct) => void;
  /** The product whose detail is open next to the list (tablet). */
  openedId?: number | null;
}

/**
 * Search by name or code, category and subcategory chips, «Лише в наявності» and sorting; every row shows the
 * chosen customer's price (R-005–R-007, SC-008). The header stays compact so the list keeps most of a phone screen:
 * search with two toggle buttons, one chip row, and one summary line.
 */
export function ProductList({
  counterpartyId,
  isOnline,
  onAdd,
  onOpen,
  openedId = null,
}: Readonly<ProductListProps>) {
  const styles = useStyles(stylesSheet);
  const list = useProductList(counterpartyId);

  // Rows are memoized, so they get stable handlers that always call the latest props.
  const handlers = useRef({ onAdd, onOpen });
  useLayoutEffect(() => {
    handlers.current = { onAdd, onOpen };
  });
  const open = useCallback((productId: number) => handlers.current.onOpen(productId), []);
  const add = useCallback((product: PricedProduct) => handlers.current.onAdd?.(product), []);
  const canAddRows = onAdd !== undefined;
  const renderItem = useCallback<ListRenderItem<PricedProduct>>(
    ({ item }) => (
      <ProductRow
        isOnline={isOnline}
        onAdd={canAddRows ? add : undefined}
        onOpen={open}
        product={item}
        selected={item.id === openedId}
      />
    ),
    [add, canAddRows, isOnline, open, openedId],
  );

  if (list.loading) return <StateView kind="loading" title="Читаємо каталог" />;
  if (list.empty) {
    return (
      <StateView
        kind="empty"
        message="Товари з’являться після синхронізації даних."
        title="Товарів немає"
      />
    );
  }

  return (
    <View style={styles.container}>
      <ProductListToolbar
        inStockOnly={list.inStockOnly}
        onQueryChange={list.setQuery}
        onSortChange={list.setSort}
        onToggleInStock={list.toggleInStock}
        query={list.query}
        sort={list.sort}
      />
      <ProductCategoryChips
        categoryId={list.categoryId}
        children={list.children}
        onSelect={list.setCategoryId}
        path={list.path}
      />
      <AppText numberOfLines={1} numeric tone="secondary" variant="secondary">
        {productListSummary(list.shown.length, list.sort, list.inStockOnly)}
      </AppText>
      {list.shown.length === 0 ? (
        <StateView
          kind="empty"
          message="Змініть пошук, категорію або фільтр."
          title="Нічого не знайдено"
        />
      ) : (
        <FlashList
          contentContainerStyle={styles.list}
          data={list.shown}
          ItemSeparatorComponent={RowGap}
          keyExtractor={keyOf}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const keyOf = (product: PricedProduct) => product.id.toString();

function RowGap() {
  const styles = useStyles(stylesSheet);
  return <View style={styles.gap} />;
}

const stylesSheet = createStyles((theme) => ({
  container: { flex: 1, gap: theme.space.sm },
  gap: { height: theme.space.sm },
  list: { paddingBottom: theme.space.xxl },
}));
