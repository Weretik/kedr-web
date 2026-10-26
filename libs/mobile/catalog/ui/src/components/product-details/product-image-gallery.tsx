import { useKedrTheme } from '@mobile/shared/ui';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
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
  const { kedr } = useKedrTheme();
  const { width: windowWidth } = useWindowDimensions();
  const width = Math.max(248, Math.min(windowWidth - 64, 528));
  const progress = useSharedValue(0);
  const { availableUrls, rejectUrl } = useProductImageGallery(imageUrls);

  if (availableUrls.length === 0) {
    return (
      <View
        style={[
          styles.stage,
          { backgroundColor: kedr.colors.primary, borderRadius: kedr.radius.xl },
        ]}
      >
        <View accessibilityLabel="Зображення товару відсутнє" style={[styles.fallback, { width }]}>
          <Icon color={kedr.colors.onPrimary} size={56} source="image-off-outline" />
          <Text style={{ color: kedr.colors.onPrimary }} variant="titleSmall">
            Зображення відсутнє
          </Text>
        </View>
      </View>
    );
  }

  if (availableUrls.length === 1) {
    return (
      <View
        style={[
          styles.stage,
          { backgroundColor: kedr.colors.primary, borderRadius: kedr.radius.xl },
        ]}
      >
        <View style={[styles.frame, { borderRadius: kedr.radius.lg, width }]}>
          <ProductImage
            onError={() => rejectUrl(availableUrls[0])}
            productName={productName}
            url={availableUrls[0]}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.stage,
        styles.gallery,
        { backgroundColor: kedr.colors.primary, borderRadius: kedr.radius.xl },
      ]}
    >
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
        style={[styles.frame, { borderRadius: kedr.radius.lg, width }]}
        testID="product-image-carousel"
      />
      <Pagination
        activeDotStyle={{
          backgroundColor: kedr.colors.onPrimary,
          borderRadius: 4,
          height: 8,
          width: 18,
        }}
        containerStyle={styles.pagination}
        count={availableUrls.length}
        dotStyle={{
          backgroundColor: 'rgba(255,255,255,0.45)',
          borderRadius: 4,
          height: 8,
          width: 8,
        }}
        progress={progress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', gap: 8, height: 260, justifyContent: 'center' },
  // Product photos are shot on white, so the photo frame stays white in both schemes.
  frame: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    height: 260,
    overflow: 'hidden',
  },
  gallery: { gap: 12 },
  stage: { alignItems: 'center', padding: 16 },
  pagination: { gap: 8 },
});
