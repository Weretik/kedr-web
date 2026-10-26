import { getProductImageCandidates, type CatalogProductDetails } from '@mobile/catalog/model';
import { actionBarReservedHeight, ScreenHeader, useKedrTheme } from '@mobile/shared/ui';
import { ScrollView, StyleSheet, View } from 'react-native';

import { ProductDetailsBreadcrumbs } from './product-details-breadcrumbs';
import { ProductDetailsCartAction } from './product-details-cart-action';
import { ProductDetailsCharacteristics } from './product-details-characteristics';
import { ProductDetailsHeader } from './product-details-header';
import { ProductImageGallery } from './product-image-gallery';

export interface ProductDetailsViewProps {
  addToCartDisabled: boolean;
  addToCartDisabledReason?: string;
  onAddToCart: () => void;
  onBack?: () => void;
  product: CatalogProductDetails;
}

export function ProductDetailsView({
  addToCartDisabled,
  addToCartDisabledReason,
  onAddToCart,
  onBack,
  product,
}: Readonly<ProductDetailsViewProps>) {
  const theme = useKedrTheme();

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScreenHeader onBack={onBack} subtitle={product.categoryName} title="Товар" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: actionBarReservedHeight + 24 }]}
        testID="product-details-scroll"
      >
        <ProductImageGallery
          imageUrls={getProductImageCandidates(product)}
          productName={product.name}
        />
        <ProductDetailsHeader
          id={product.id}
          name={product.name}
          price={product.price}
          stock={product.stock}
        />
        <ProductDetailsCharacteristics product={product} />
        <ProductDetailsBreadcrumbs breadcrumbs={product.breadcrumbs} />
      </ScrollView>
      <ProductDetailsCartAction
        disabled={addToCartDisabled}
        disabledReason={addToCartDisabledReason}
        onAddToCart={onAddToCart}
        price={product.price}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, paddingHorizontal: 16, paddingTop: 4 },
  screen: { flex: 1 },
});
