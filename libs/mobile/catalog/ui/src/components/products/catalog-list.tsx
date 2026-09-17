import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import { StyleSheet, View } from 'react-native';

import { ProductCard } from './product-card';

import type { CatalogProduct } from '@mobile/catalog/model';
import type { ReactElement } from 'react';

export interface CatalogListProps {
  footer?: ReactElement | null;
  items: readonly CatalogProduct[];
  onProductPress: (product: CatalogProduct) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function CatalogList({
  footer,
  items,
  onProductPress,
  onRefresh,
  refreshing,
}: Readonly<CatalogListProps>) {
  const renderItem: ListRenderItem<CatalogProduct> = ({ item }) => (
    <ProductCard onPress={onProductPress} product={item} />
  );

  return (
    <FlashList
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item) => item.id}
      ListFooterComponent={footer}
      ItemSeparatorComponent={ListSeparator}
      onRefresh={onRefresh}
      refreshing={refreshing}
      renderItem={renderItem}
      style={styles.list}
      testID="catalog-list"
    />
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingBottom: 112,
    paddingTop: 16,
  },
  list: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
});

function ListSeparator() {
  return <View style={styles.separator} />;
}
