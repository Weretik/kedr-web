import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface ProductDetailsHeaderProps {
  id: string;
  name: string;
  price: number | null;
}

export function ProductDetailsHeader({ id, name, price }: Readonly<ProductDetailsHeaderProps>) {
  const theme = useTheme();
  const priceText = price === null ? 'Ціну уточнюйте' : `${price} грн.`;

  return (
    <View style={styles.heading}>
      <Text accessibilityRole="header" variant="headlineSmall">
        {name}
      </Text>
      <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">
        ID: {id}
      </Text>
      <Text style={{ color: theme.colors.primary, fontWeight: '700' }} variant="headlineSmall">
        {priceText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({ heading: { gap: 8 } });
