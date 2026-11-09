import { useCategories, usePricedProducts } from '@mobile/catalog/data-access';
import {
  categoryPath,
  childrenOf,
  filterProducts,
  sortNameOrdered,
  withDescendants,
  type PricedProduct,
  type ProductSort,
} from '@mobile/catalog/model';
import { ProductRow } from '@mobile/catalog/ui';
import { AppText, Chip, createStyles, SearchField, StateView, useStyles } from '@mobile/shared/ui';
import { useCallback, useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ScrollView, View, type ListRenderItem } from 'react-native';

export interface ProductListProps {
  counterpartyId: string | null;
  isOnline: boolean | null;
  onOpen: (productId: number) => void;
  /** «+» on each row: adds the product to the calculation (R-009). */
  onAdd?: (product: PricedProduct) => void;
  /** The product whose detail is open next to the list (tablet). */
  openedId?: number | null;
}

const sortLabels: Record<ProductSort, string> = {
  name: 'За назвою',
  'price-asc': 'Спочатку дешевші',
  'price-desc': 'Спочатку дорожчі',
};
const nextSort: Record<ProductSort, ProductSort> = {
  name: 'price-asc',
  'price-asc': 'price-desc',
  'price-desc': 'name',
};

/**
 * Search by name or code, category and subcategory chips, «Лише в наявності» and sorting; every row shows the
 * chosen customer's price (R-005–R-007, SC-008).
 */
export function ProductList({
  counterpartyId,
  isOnline,
  onAdd,
  onOpen,
  openedId = null,
}: Readonly<ProductListProps>) {
  const styles = useStyles(stylesSheet);
  const categories = useCategories();
  const products = usePricedProducts(counterpartyId);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>('name');

  const path = categoryId === null ? [] : categoryPath(categories, categoryId);
  const children = childrenOf(categories, categoryId);

  // Products arrive in name order, so filtering keeps it and only a price sort reorders.
  const filtered = useMemo(
    () =>
      filterProducts(products, {
        categoryIds: categoryId === null ? null : withDescendants(categories, categoryId),
        inStockOnly,
        query: deferredQuery,
      }),
    [categories, categoryId, deferredQuery, inStockOnly, products],
  );
  const shown = useMemo(() => sortNameOrdered(filtered, sort), [filtered, sort]);

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

  if (products.length === 0) {
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
      <SearchField
        accessibilityLabel="Пошук товару"
        onChangeText={setQuery}
        placeholder="Назва або код"
        value={query}
      />
      <ScrollView
        contentContainerStyle={styles.chips}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Chip
          icon={categoryId === null ? undefined : 'arrow-left'}
          label={categoryId === null ? 'Усі категорії' : 'Усі'}
          onPress={() => setCategoryId(null)}
          selected={categoryId === null}
        />
        {path.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onPress={() => setCategoryId(category.id)}
            selected={category.id === categoryId}
          />
        ))}
        {children.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            onPress={() => setCategoryId(category.id)}
          />
        ))}
      </ScrollView>
      <View style={styles.filters}>
        <Chip
          icon={inStockOnly ? 'check' : undefined}
          label="Лише в наявності"
          onPress={() => setInStockOnly((value) => !value)}
          selected={inStockOnly}
        />
        <Chip icon="sort" label={sortLabels[sort]} onPress={() => setSort(nextSort[sort])} />
        <AppText style={styles.count} tone="secondary" variant="secondary">
          {`${shown.length} шт.`}
        </AppText>
      </View>
      {shown.length === 0 ? (
        <StateView
          kind="empty"
          message="Змініть пошук, категорію або фільтр."
          title="Нічого не знайдено"
        />
      ) : (
        <FlatList
          contentContainerStyle={styles.list}
          data={shown}
          initialNumToRender={10}
          keyExtractor={keyOf}
          keyboardShouldPersistTaps="handled"
          maxToRenderPerBatch={8}
          removeClippedSubviews
          renderItem={renderItem}
          windowSize={7}
        />
      )}
    </View>
  );
}

const keyOf = (product: PricedProduct) => product.id.toString();

const stylesSheet = createStyles((theme) => ({
  chips: { gap: theme.space.sm },
  container: { flex: 1, gap: theme.space.md },
  count: { flex: 1, textAlign: 'right' },
  filters: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
  list: { gap: theme.space.sm, paddingBottom: theme.space.xxl },
}));
