import { getProductImageCandidates, type CatalogProductDetails } from '@mobile/catalog/model';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

import { ProductDetailsBreadcrumbs } from './product-details-breadcrumbs';
import { ProductDetailsCartAction } from './product-details-cart-action';
import { ProductDetailsCharacteristics } from './product-details-characteristics';
import { ProductDetailsHeader } from './product-details-header';
import { ProductImageGallery } from './product-image-gallery';

export interface ProductDetailsViewProps {
  addToCartDisabled: boolean;
  addToCartDisabledReason?: string;
  onAddToCart: () => void;
  product: CatalogProductDetails;
}

export function ProductDetailsView({
  addToCartDisabled,
  addToCartDisabledReason,
  onAddToCart,
  product,
}: Readonly<ProductDetailsViewProps>) {
  const theme = useTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.content} testID="product-details-scroll">
        <ProductImageGallery
          imageUrls={getProductImageCandidates(product)}
          productName={product.name}
        />
        <ProductDetailsHeader id={product.id} name={product.name} price={product.price} />
        <ProductDetailsCharacteristics product={product} />
        <ProductDetailsBreadcrumbs breadcrumbs={product.breadcrumbs} />
      </ScrollView>
      <ProductDetailsCartAction
        disabled={addToCartDisabled}
        disabledReason={addToCartDisabledReason}
        onAddToCart={onAddToCart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 20, paddingBottom: 24, paddingHorizontal: 16, paddingTop: 16 },
  screen: { flex: 1 },
});
