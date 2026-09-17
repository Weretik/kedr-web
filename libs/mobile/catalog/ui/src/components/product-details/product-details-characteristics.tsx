import { type CatalogProductDetails } from '@mobile/catalog/model';
import { StyleSheet, View } from 'react-native';
import { Divider, Surface, Text, useTheme } from 'react-native-paper';

export function ProductDetailsCharacteristics({
  product,
}: Readonly<{ product: CatalogProductDetails }>) {
  const theme = useTheme();

  return (
    <Surface elevation={0} style={[styles.section, { backgroundColor: theme.colors.surface }]}>
      <Text variant="titleMedium">Характеристики</Text>
      <Divider />
      <DetailRow label="Категорія" value={product.categoryName} />
      <DetailRow label="Код категорії" value={product.categorySlug} />
      <DetailRow label="Залишок" value={`${product.stock}`} />
      <DetailRow label="Кількість в упаковці" value={`${product.quantityInPack}`} />
    </Surface>
  );
}

function DetailRow({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <View style={styles.row}>
      <Text variant="bodyMedium">{label}</Text>
      <Text style={styles.rowValue} variant="bodyMedium">
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, justifyContent: 'space-between' },
  rowValue: { flexShrink: 1, fontWeight: '600', textAlign: 'right' },
  section: { borderRadius: 16, gap: 12, padding: 16 },
});
