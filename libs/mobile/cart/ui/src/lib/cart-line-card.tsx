import { Image, type ImageProps } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import { Card, IconButton, Text, useTheme } from 'react-native-paper';

import { formatMoney } from './format-money';

import type { CartLine } from '@mobile/cart/model';
import type { ComponentType } from 'react';

const CachedImage = Image as unknown as ComponentType<ImageProps>;

export interface CartLineCardProps {
  line: CartLine;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
}

export function CartLineCard({
  line,
  onDecrement,
  onIncrement,
  onRemove,
}: Readonly<CartLineCardProps>) {
  const theme = useTheme();

  return (
    <Card mode="contained" style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.imageFrame} testID={`cart-item-image-frame-${line.id}`}>
          {line.imageUrl ? (
            <CachedImage
              accessibilityLabel={`Зображення ${line.name}`}
              cachePolicy="memory-disk"
              contentFit="contain"
              source={{ uri: line.imageUrl }}
              style={styles.image}
              transition={180}
            />
          ) : (
            <View
              accessibilityLabel={`Зображення ${line.name} відсутнє`}
              style={[
                styles.image,
                styles.imageFallback,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            >
              <Text variant="bodySmall">Фото відсутнє</Text>
            </View>
          )}
        </View>
        <View style={styles.details}>
          <View style={styles.titleRow}>
            <Text numberOfLines={2} style={styles.name} variant="titleMedium">
              {line.name}
            </Text>
            <IconButton
              accessibilityLabel={`Видалити ${line.name}`}
              icon="delete-outline"
              onPress={onRemove}
            />
          </View>
          <Text>{formatMoney(line.unitPrice)} за одиницю</Text>
          <View style={styles.quantityRow}>
            <Text style={styles.lineAmount}>{formatMoney(line.unitPrice * line.quantity)}</Text>
            <View style={styles.stepper}>
              <IconButton
                accessibilityLabel={`Зменшити кількість ${line.name}`}
                disabled={line.quantity <= 1}
                icon="minus"
                onPress={onDecrement}
              />
              <Text accessibilityLabel={`Кількість ${line.name}: ${line.quantity}`}>
                {line.quantity}
              </Text>
              <IconButton
                accessibilityLabel={`Збільшити кількість ${line.name}`}
                disabled={line.quantity >= line.stock}
                icon="plus"
                onPress={onIncrement}
              />
            </View>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  cardContent: { alignItems: 'center', flexDirection: 'row', gap: 12 },
  details: { flex: 1, gap: 8 },
  image: { height: '100%', width: '100%' },
  imageFallback: { alignItems: 'center', justifyContent: 'center', padding: 6 },
  imageFrame: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 88,
    overflow: 'hidden',
    width: 88,
  },
  lineAmount: { flex: 1, fontWeight: '700' },
  name: { flex: 1 },
  quantityRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  stepper: { alignItems: 'center', flexDirection: 'row' },
  titleRow: { alignItems: 'flex-start', flexDirection: 'row' },
});
