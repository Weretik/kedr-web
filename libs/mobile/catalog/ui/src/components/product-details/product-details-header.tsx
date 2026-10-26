import { StatusPill, tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface ProductDetailsHeaderProps {
  id: string;
  name: string;
  price: number | null;
  stock?: number;
}

export function ProductDetailsHeader({
  id,
  name,
  price,
  stock,
}: Readonly<ProductDetailsHeaderProps>) {
  const { kedr } = useKedrTheme();
  const priceText = price === null ? 'Ціну уточнюйте' : `${price} грн.`;

  return (
    <View style={styles.heading}>
      <View style={styles.meta}>
        {stock === undefined ? null : stock > 0 ? (
          <StatusPill kind="success" label={`В наявності · ${stock} шт`} />
        ) : (
          <StatusPill kind="error" label="Немає в наявності" />
        )}
        <Text
          style={[tabularNumbers, { color: kedr.colors.onSurfaceVariant }]}
          variant="labelSmall"
        >
          ID: {id}
        </Text>
      </View>
      <Text
        accessibilityRole="header"
        style={[kedr.type.productTitle, { color: kedr.colors.onSurface }]}
      >
        {name}
      </Text>
      <Text style={[kedr.type.priceLarge, tabularNumbers, { color: kedr.colors.onSurface }]}>
        {priceText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { gap: 8 },
  meta: { alignItems: 'center', flexDirection: 'row', gap: 10, justifyContent: 'space-between' },
});
