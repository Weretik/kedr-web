import { useCategories, usePricedProducts } from '@mobile/catalog/data-access';
import {
  categoryPath,
  childrenOf,
  filterProducts,
  sortProducts,
  withDescendants,
  type ProductSort,
} from '@mobile/catalog/model';
import { ProductRow } from '@mobile/catalog/ui';
import { AppText, Chip, SearchField, StateView } from '@mobile/shared/ui';
import { useDeferredValue, useMemo, useState } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

export interface ProductListProps {
  counterpartyId: string | null;
  isOnline: boolean | null;
  onOpen: (productId: number) => void;
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
  onOpen,
  openedId = null,
}: Readonly<ProductListProps>) {
  const categories = useCategories();
  const products = usePricedProducts(counterpartyId);
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<ProductSort>('name');

  const path = categoryId === null ? [] : categoryPath(categories, categoryId);
  const children = childrenOf(categories, categoryId);

  const shown = useMemo(
    () =>
      sortProducts(
        filterProducts(products, {
          categoryIds: categoryId === null ? null : withDescendants(categories, categoryId),
          inStockOnly,
          query: deferredQuery,
        }),
        sort,
      ),
    [categories, categoryId, deferredQuery, inStockOnly, products, sort],
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
          initialNumToRender={12}
          keyExtractor={(product) => product.id.toString()}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <ProductRow
              isOnline={isOnline}
              onOpen={() => onOpen(item.id)}
              product={item}
              selected={item.id === openedId}
            />
          )}
          windowSize={7}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  chips: { gap: theme.space.sm },
  container: { flex: 1, gap: theme.space.md },
  count: { flex: 1, textAlign: 'right' },
  filters: { alignItems: 'center', flexDirection: 'row', gap: theme.space.sm },
  list: { gap: theme.space.sm, paddingBottom: theme.space.xxl },
}));
