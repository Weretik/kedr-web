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
  const renderItem: ListRenderItem<CatalogProduct> = ({ index, item }) => (
    <View style={index % 2 === 0 ? styles.leftCell : styles.rightCell}>
      <ProductCard onPress={onProductPress} product={item} />
    </View>
  );

  return (
    <FlashList
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={2}
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
    paddingBottom: 24,
    paddingHorizontal: 11,
    paddingTop: 12,
  },
  leftCell: { flex: 1, paddingHorizontal: 5 },
  list: {
    flex: 1,
  },
  rightCell: { flex: 1, paddingHorizontal: 5 },
  separator: {
    height: 10,
  },
});

function ListSeparator() {
  return <View style={styles.separator} />;
}
