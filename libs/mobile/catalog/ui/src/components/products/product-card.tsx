import {
  PressableScale,
  StatusPill,
  tabularNumbers,
  useKedrTheme,
  type KedrStatusKind,
} from '@mobile/shared/ui';
import { Image, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import type { CatalogProduct } from '@mobile/catalog/model';

export interface ProductCardProps {
  onPress: (product: CatalogProduct) => void;
  product: CatalogProduct;
}

const availability: Record<
  CatalogProduct['availability'],
  { kind: KedrStatusKind; label: string }
> = {
  in_stock: { kind: 'success', label: 'В наявності' },
  out_of_stock: { kind: 'error', label: 'Немає в наявності' },
  unknown: { kind: 'warning', label: 'Наявність уточнюється' },
};

/** Product tile for the two-column catalog grid. */
export function ProductCard({ onPress, product }: Readonly<ProductCardProps>) {
  const { kedr } = useKedrTheme();
  const status = availability[product.availability];

  return (
    <PressableScale
      accessibilityLabel={`Товар ${product.name}. ${status.label}. ID: ${product.id}.`}
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={[styles.tile, { backgroundColor: kedr.colors.surface, borderRadius: kedr.radius.lg }]}
    >
      <View
        style={[
          styles.well,
          { backgroundColor: kedr.colors.surfaceVariant, borderRadius: kedr.radius.md },
        ]}
      >
        {product.imageUrl ? (
          <View
            style={[
              styles.frame,
              { backgroundColor: kedr.colors.photoFrame, borderRadius: kedr.radius.sm },
            ]}
          >
            <Image
              accessibilityLabel={`Фото товару ${product.name}`}
              resizeMode="contain"
              source={{ uri: product.imageUrl }}
              style={styles.image}
            />
          </View>
        ) : (
          <View accessibilityLabel="Фото товару відсутнє" style={styles.fallback}>
            <Icon color={kedr.colors.primary} size={36} source="image-off-outline" />
          </View>
        )}
      </View>
      <Text
        numberOfLines={1}
        style={[styles.id, tabularNumbers, { color: kedr.colors.onSurfaceVariant }]}
        variant="labelSmall"
      >
        {`ID: ${product.id}`}
      </Text>
      <Text
        accessibilityRole="header"
        numberOfLines={2}
        style={[styles.name, { color: kedr.colors.onSurface }]}
        variant="bodySmall"
      >
        {product.name}
      </Text>
      <Text
        numberOfLines={1}
        style={[kedr.type.price, tabularNumbers, { color: kedr.colors.onSurface }]}
      >
        {product.price === null ? 'Ціну уточнюйте' : `${product.price} грн.`}
      </Text>
      <StatusPill kind={status.kind} label={status.label} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  frame: { flex: 1, margin: 8, overflow: 'hidden' },
  id: { marginTop: 2 },
  image: { height: '100%', width: '100%' },
  name: { minHeight: 34 },
  tile: { flex: 1, gap: 4, padding: 8 },
  well: { aspectRatio: 1 / 0.82, overflow: 'hidden', width: '100%' },
});
