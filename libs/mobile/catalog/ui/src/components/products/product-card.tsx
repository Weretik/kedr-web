import { Image, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

import type { CatalogProduct } from '@mobile/catalog/model';

export interface ProductCardProps { product: CatalogProduct; }

const availabilityLabels: Record<CatalogProduct['availability'], string> = {
  in_stock: 'В наявності',
  out_of_stock: 'Немає в наявності',
  unknown: 'Наявність уточнюється',
};

export function ProductCard({ product }: Readonly<ProductCardProps>) {
  const theme = useTheme();
  const availability = availabilityLabels[product.availability];
  const availabilityColor = product.availability === 'in_stock' ? theme.colors.primary : product.availability === 'out_of_stock' ? theme.colors.error : theme.colors.tertiary;

  return (
    <Card accessibilityLabel={`Товар ${product.name}. ${availability}. ID: ${product.id}.`} mode="elevated" style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content style={styles.content}>
        <View style={styles.imageFrame}>
          {product.imageUrl ? <Image accessibilityLabel={`Фото товару ${product.name}`} resizeMode="contain" source={{ uri: product.imageUrl }} style={styles.image} /> : <View accessibilityLabel="Фото товару відсутнє" style={[styles.image, styles.imageFallback, { backgroundColor: theme.colors.surfaceVariant }]}><Text variant="bodyMedium">Фото відсутнє</Text></View>}
        </View>
        <View style={styles.details}>
          <Text numberOfLines={1} style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700' }} variant="bodySmall">{`ID: ${product.id}`}</Text>
          <Text accessibilityRole="header" numberOfLines={2} style={{ color: theme.colors.onSurface, fontWeight: '400' }} variant="bodyMedium">{product.name}</Text>
          <View style={styles.summaryRow}>
            <Text style={{ color: theme.colors.onSurface, fontWeight: '700' }} variant="titleMedium">{product.price === null ? 'Ціну уточнюйте' : `${product.price} грн.`}</Text>
            <Text numberOfLines={1} style={{ color: availabilityColor, flexShrink: 1, textAlign: 'right' }} variant="bodyMedium">{availability}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { minHeight: 120 },
  content: { flexDirection: 'row', gap: 12, padding: 12 },
  details: { flex: 1, gap: 6, justifyContent: 'center' },
  image: { height: '100%', width: '100%' },
  imageFallback: { alignItems: 'center', justifyContent: 'center', padding: 8 },
  imageFrame: { backgroundColor: '#ffffff', borderRadius: 8, height: 96, overflow: 'hidden', width: 96 },
  summaryRow: { alignItems: 'center', flexDirection: 'row', gap: 8, justifyContent: 'space-between' },
});
