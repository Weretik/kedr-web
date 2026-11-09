import { useCategories, usePricedProducts } from '@mobile/catalog/data-access';
import {
  categoryPath,
  childrenOf,
  filterProducts,
  sortNameOrdered,
  withDescendants,
  type Category,
  type PricedProduct,
  type ProductSort,
} from '@mobile/catalog/model';
import { ProductRow } from '@mobile/catalog/ui';
import {
  AppText,
  Chip,
  createStyles,
  IconButton,
  SearchField,
  StateView,
  useStyles,
} from '@mobile/shared/ui';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { useCallback, useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';

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
  name: 'за назвою',
  'price-asc': 'спочатку дешевші',
  'price-desc': 'спочатку дорожчі',
};
const nextSort: Record<ProductSort, ProductSort> = {
  name: 'price-asc',
  'price-asc': 'price-desc',
  'price-desc': 'name',
};

/**
 * Search by name or code, category and subcategory chips, «Лише в наявності» and sorting; every row shows the
 * chosen customer's price (R-005–R-007, SC-008). The header stays compact so the list keeps most of a phone screen:
 * search with two toggle buttons, one chip row, and one summary line.
 */
const noCategories: Category[] = [];
const noProducts: PricedProduct[] = [];

export function ProductList({
  counterpartyId,
  isOnline,
  onAdd,
  onOpen,
  openedId = null,
}: Readonly<ProductListProps>) {
  const styles = useStyles(stylesSheet);
  const loadedCategories = useCategories();
  const loadedProducts = usePricedProducts(counterpartyId);
  const categories = loadedCategories ?? noCategories;
  const products = loadedProducts ?? noProducts;
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

  if (loadedProducts === undefined) return <StateView kind="loading" title="Читаємо каталог" />;
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
      <View style={styles.toolbar}>
        <View style={styles.search}>
          <SearchField
            accessibilityLabel="Пошук товару"
            onChangeText={setQuery}
            placeholder="Назва або код"
            value={query}
          />
        </View>
        <IconButton
          accessibilityLabel="Лише в наявності"
          icon="package-variant-closed-check"
          onPress={() => setInStockOnly((value) => !value)}
          selected={inStockOnly}
          variant="outlined"
        />
        <IconButton
          accessibilityLabel={`Сортування: ${sortLabels[sort]}`}
          icon="sort"
          onPress={() => setSort(nextSort[sort])}
          selected={sort !== 'name'}
          variant="outlined"
        />
      </View>
      <ScrollView
        contentContainerStyle={styles.chips}
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        style={styles.chipRow}
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
      <AppText numberOfLines={1} numeric tone="secondary" variant="secondary">
        {[`${shown.length} шт.`, sortLabels[sort], inStockOnly ? 'лише в наявності' : null]
          .filter(Boolean)
          .join(' · ')}
      </AppText>
      {shown.length === 0 ? (
        <StateView
          kind="empty"
          message="Змініть пошук, категорію або фільтр."
          title="Нічого не знайдено"
        />
      ) : (
        <FlashList
          contentContainerStyle={styles.list}
          data={shown}
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
  // A horizontal ScrollView grows to fill a column by default; the chip row keeps its own height.
  chipRow: { flexGrow: 0, flexShrink: 0 },
  chips: { alignItems: 'center', gap: theme.space.sm },
  container: { flex: 1, gap: theme.space.sm },
  gap: { height: theme.space.sm },
  list: { paddingBottom: theme.space.xxl },
  search: { flex: 1 },
  toolbar: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
}));
