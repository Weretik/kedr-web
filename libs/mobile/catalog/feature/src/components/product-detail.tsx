import { useCategories, usePricedProduct } from '@mobile/catalog/data-access';
import {
  canAdd,
  categoryPath,
  formatStock,
  isOutOfStock,
  productImages,
  type Category,
  type PricedProduct,
} from '@mobile/catalog/model';
import { ProductGallery, ZoomViewer } from '@mobile/catalog/ui';
import { formatKopecks } from '@mobile/shared/model';
import {
  AppText,
  Button,
  Card,
  createStyles,
  StateView,
  StatusPill,
  useStyles,
} from '@mobile/shared/ui';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

export interface ProductDetailProps {
  counterpartyId: string | null;
  customerName: string | null;
  isOnline: boolean | null;
  /** Adds the product to the chosen customer's calculation (R-009). */
  onAdd?: (product: PricedProduct) => void;
  productId: number;
}

/** From this width the photo and the scheme stand side by side instead of the «Фото | Схема» switch (SC-025). */
const SIDE_BY_SIDE_MIN_WIDTH = 520;

/** Large photos and scheme, name, code, category, stock and the customer's price (R-005–R-008). */
const noCategories: Category[] = [];

export function ProductDetail({
  counterpartyId,
  customerName,
  isOnline,
  onAdd,
  productId,
}: Readonly<ProductDetailProps>) {
  const styles = useStyles(stylesSheet);
  const product = usePricedProduct(productId, counterpartyId);
  const categories = useCategories() ?? noCategories;
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  // The column width, not the screen class, decides: a tablet column can be as narrow as a phone.
  const [width, setWidth] = useState(0);

  if (product === undefined) return <StateView kind="loading" title="Читаємо товар" />;
  if (!product) {
    return (
      <StateView
        kind="empty"
        message="Товару немає в останніх даних каталогу."
        title="Товар не знайдено"
      />
    );
  }

  const outOfStock = isOutOfStock(product);
  const category = categoryPath(categories, product.categoryId)
    .map((item) => item.name)
    .join(' › ');

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      testID="product-detail"
    >
      <ProductGallery
        isOnline={isOnline}
        onOpenFullScreen={setViewerIndex}
        product={product}
        sideBySide={width >= SIDE_BY_SIDE_MIN_WIDTH}
      />
      <AppText accessibilityRole="header" variant="sectionTitle">
        {product.name}
      </AppText>
      <Card style={styles.card}>
        <Line label="Код" value={product.id.toString()} />
        <Line label="Категорія" value={category || '—'} />
        <View style={styles.line}>
          <AppText style={styles.label} tone="secondary" variant="secondary">
            Залишок
          </AppText>
          {outOfStock ? (
            <StatusPill kind="warning" label="немає в наявності" />
          ) : (
            <AppText numeric variant="body">
              {formatStock(product.stock)}
            </AppText>
          )}
        </View>
        {product.quantityInPack > 1 ? (
          <Line label="В упаковці" value={`${product.quantityInPack} шт.`} />
        ) : null}
      </Card>
      <Card style={styles.card}>
        <AppText tone="secondary" variant="caption">
          {customerName ? `Ціна для ${customerName}` : 'Ціна клієнта'}
        </AppText>
        <AppText numeric variant={product.priceKopecks === null ? 'body' : 'total'}>
          {product.priceKopecks === null ? 'Ціну уточнюйте' : formatKopecks(product.priceKopecks)}
        </AppText>
        {onAdd ? (
          <Button
            disabled={!canAdd(product)}
            icon="plus"
            label="Додати в розрахунок"
            onPress={() => onAdd(product)}
          />
        ) : null}
      </Card>
      <ZoomViewer
        images={productImages(product)}
        initialIndex={viewerIndex}
        onClose={() => setViewerIndex(null)}
      />
    </ScrollView>
  );
}

function Line({ label, value }: Readonly<{ label: string; value: string }>) {
  const styles = useStyles(stylesSheet);
  return (
    <View style={styles.line}>
      <AppText style={styles.label} tone="secondary" variant="secondary">
        {label}
      </AppText>
      <AppText numeric selectable style={styles.value} variant="body">
        {value}
      </AppText>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  card: { gap: theme.space.sm },
  content: { gap: theme.space.md, paddingBottom: theme.space.xxl },
  label: { width: 88 },
  line: { alignItems: 'center', flexDirection: 'row', gap: theme.space.md },
  value: { flex: 1 },
}));
