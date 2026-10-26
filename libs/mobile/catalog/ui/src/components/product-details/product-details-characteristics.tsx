import { type CatalogProductDetails } from '@mobile/catalog/model';
import { KedrCard, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

export function ProductDetailsCharacteristics({
  product,
}: Readonly<{ product: CatalogProductDetails }>) {
  return (
    <KedrCard title="Характеристики">
      <DetailRow label="Категорія" value={product.categoryName} />
      <DetailRow label="Код категорії" value={product.categorySlug} />
      <DetailRow label="Залишок" value={`${product.stock}`} />
      <DetailRow label="Кількість в упаковці" value={`${product.quantityInPack}`} />
    </KedrCard>
  );
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  const { kedr } = useKedrTheme();
  return (
    <View style={[styles.row, { borderTopColor: kedr.colors.outlineVariant }]}>
      <Text style={{ color: kedr.colors.onSurfaceVariant }} variant="bodyMedium">
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: kedr.colors.onSurface }]} variant="labelLarge">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  rowValue: { flexShrink: 1, textAlign: 'right' },
});
