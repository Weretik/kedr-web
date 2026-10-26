import { QuantityStepper, tabularNumbers, useKedrTheme } from '@mobile/shared/ui';
import { Image, type ImageProps } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { formatMoney } from '../../utils/format-money';

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
  const { kedr } = useKedrTheme();

  return (
    <View
      style={[styles.card, { backgroundColor: kedr.colors.surface, borderRadius: kedr.radius.lg }]}
    >
      <View
        style={[styles.imageFrame, { borderRadius: kedr.radius.md }]}
        testID={`cart-item-image-frame-${line.id}`}
      >
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
              { backgroundColor: kedr.colors.surfaceVariant },
            ]}
          >
            <Icon color={kedr.colors.primary} size={26} source="image-off-outline" />
          </View>
        )}
      </View>
      <View style={styles.details}>
        <Text numberOfLines={2} style={{ color: kedr.colors.onSurface }} variant="bodySmall">
          {line.name}
        </Text>
        <Text
          style={[tabularNumbers, { color: kedr.colors.onSurfaceVariant }]}
          variant="labelSmall"
        >
          {formatMoney(line.unitPrice)} за одиницю
        </Text>
        <View style={styles.amountRow}>
          <Text style={[kedr.type.price, tabularNumbers, { color: kedr.colors.onSurface }]}>
            {formatMoney(line.unitPrice * line.quantity)}
          </Text>
          <Pressable
            accessibilityLabel={`Видалити ${line.name}`}
            accessibilityRole="button"
            hitSlop={8}
            onPress={onRemove}
            style={styles.remove}
          >
            <Icon
              color={kedr.colors.status.error.foreground}
              size={18}
              source="trash-can-outline"
            />
          </Pressable>
        </View>
      </View>
      <QuantityStepper
        itemName={line.name}
        max={line.stock}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
        orientation="vertical"
        value={line.quantity}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  amountRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  card: { alignItems: 'center', flexDirection: 'row', gap: 10, marginBottom: 10, padding: 8 },
  details: { flex: 1, gap: 4 },
  image: { height: '100%', width: '100%' },
  imageFallback: { alignItems: 'center', justifyContent: 'center' },
  // Product photos are shot on white, so the frame stays white in both schemes.
  imageFrame: { backgroundColor: '#ffffff', height: 72, overflow: 'hidden', width: 72 },
  remove: { alignItems: 'center', height: 32, justifyContent: 'center', width: 32 },
});
