import { canAdd, formatStock, isOutOfStock, type PricedProduct } from '@mobile/catalog/model';
import { formatKopecks } from '@mobile/shared/model';
import { AppText, IconButton, StatusPill } from '@mobile/shared/ui';
import { memo } from 'react';
import { Pressable, View } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

import { ProductImage } from './product-image';

export interface ProductRowProps {
  isOnline: boolean | null;
  onOpen: (productId: number) => void;
  /** Present once the calculation exists; disabled when the product is out of stock or has no price. */
  onAdd?: (product: PricedProduct) => void;
  product: PricedProduct;
  /** Marks the product whose detail is open next to the list (tablet). */
  selected?: boolean;
}

/** Photo, name, code, stock and the customer's price (R-005, R-006); memoized for long lists. */
export const ProductRow = memo(function ProductRow({
  isOnline,
  onAdd,
  onOpen,
  product,
  selected = false,
}: Readonly<ProductRowProps>) {
  const outOfStock = isOutOfStock(product);
  const price =
    product.priceKopecks === null ? 'Ціну уточнюйте' : formatKopecks(product.priceKopecks);

  return (
    <View style={styles.row(selected)}>
      <Pressable
        accessibilityHint="Відкриває картку товару"
        accessibilityLabel={`${product.name}, ${price}`}
        accessibilityRole="button"
        onPress={() => onOpen(product.id)}
        style={({ pressed }) => styles.main(pressed)}
      >
        <View style={styles.thumb}>
          <ProductImage
            accessibilityLabel="Фото"
            compact
            isOnline={isOnline}
            url={product.photos[0] ?? null}
          />
        </View>
        <View style={styles.text}>
          <AppText numberOfLines={2} variant="bodyStrong">
            {product.name}
          </AppText>
          <AppText numeric tone="secondary" variant="secondary">
            {`Код ${product.id}`}
            {outOfStock ? '' : ` · ${formatStock(product.stock)}`}
          </AppText>
          {outOfStock ? <StatusPill kind="warning" label="немає в наявності" /> : null}
        </View>
        <AppText
          numeric
          style={styles.price}
          tone={product.priceKopecks === null ? 'secondary' : 'default'}
          variant={product.priceKopecks === null ? 'secondary' : 'price'}
        >
          {price}
        </AppText>
      </Pressable>
      {onAdd ? (
        <IconButton
          accessibilityLabel={`Додати ${product.name}`}
          disabled={!canAdd(product)}
          icon="plus"
          onPress={() => onAdd(product)}
          variant="filled"
        />
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  main: (pressed: boolean) => ({
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: theme.space.md,
    opacity: pressed ? theme.motion.pressedOpacity : 1,
  }),
  price: { maxWidth: 120, textAlign: 'right' },
  row: (selected: boolean) => ({
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: selected ? theme.colors.brand : theme.colors.outlineVariant,
    borderRadius: theme.radius.lg,
    borderWidth: selected ? 2 : theme.sizes.border,
    flexDirection: 'row',
    gap: theme.space.md,
    padding: theme.space.md,
  }),
  text: { flex: 1, gap: 2 },
  thumb: { height: 64, width: 64 },
}));
