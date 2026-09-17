import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useSharedValue } from 'react-native-reanimated';
import { Carousel, Pagination } from 'react-native-reanimated-carousel';

import { ProductImage } from './product-image';
import { useProductImageGallery } from './use-product-image-gallery';

export interface ProductImageGalleryProps {
  imageUrls: readonly string[];
  productName: string;
}

export function ProductImageGallery({
  imageUrls,
  productName,
}: Readonly<ProductImageGalleryProps>) {
  const theme = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(280, Math.min(windowWidth - 32, 560));
  const progress = useSharedValue(0);
  const { availableUrls, rejectUrl } = useProductImageGallery(imageUrls);

  if (availableUrls.length === 0) {
    return (
      <View
        accessibilityLabel="Зображення товару відсутнє"
        style={[styles.fallback, { backgroundColor: theme.colors.surfaceVariant, width }]}
      >
        <Text variant="titleMedium">Зображення відсутнє</Text>
      </View>
    );
  }

  if (availableUrls.length === 1) {
    return (
      <View style={[styles.frame, { width }]}>
        <ProductImage
          onError={() => rejectUrl(availableUrls[0])}
          productName={productName}
          url={availableUrls[0]}
        />
      </View>
    );
  }

  return (
    <View style={styles.gallery}>
      <Carousel
        data={[...availableUrls]}
        itemSize={width}
        keyExtractor={(url) => url}
        loop={false}
        onConfigurePanGesture={(gesture) => gesture.activeOffsetX([-10, 10])}
        progress={progress}
        renderItem={({ item, index }) => (
          <ProductImage
            onError={() => rejectUrl(item)}
            productName={productName}
            position={index + 1}
            url={item}
          />
        )}
        style={[styles.frame, { width }]}
        testID="product-image-carousel"
      />
      <Pagination
        activeDotStyle={{ backgroundColor: theme.colors.primary, height: 8, width: 18 }}
        containerStyle={styles.pagination}
        count={availableUrls.length}
        dotStyle={{ backgroundColor: theme.colors.outlineVariant, height: 8, width: 8 }}
        progress={progress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', borderRadius: 16, height: 300, justifyContent: 'center' },
  frame: {
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    height: 300,
    overflow: 'hidden',
  },
  gallery: { alignItems: 'center', gap: 12 },
  pagination: { gap: 8 },
});
