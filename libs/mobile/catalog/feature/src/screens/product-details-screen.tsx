import { ProductDetailsState, ProductDetailsView } from '@mobile/catalog/ui';
import { Snackbar } from 'react-native-paper';

import { useProductDetailsController } from '../hooks/use-product-details-controller';

export interface ProductDetailsScreenProps {
  isOnline?: boolean;
  productSlug?: string;
}

export function ProductDetailsScreen({
  isOnline = true,
  productSlug,
}: Readonly<ProductDetailsScreenProps>) {
  const { cartMessage, dismissCartMessage, pageState } = useProductDetailsController({
    isOnline,
    productSlug,
  });

  return (
    <>
      {pageState.kind === 'ready' ? (
        <ProductDetailsView {...pageState} />
      ) : (
        <ProductDetailsState {...pageState} />
      )}
      <Snackbar
        action={{ label: 'Закрити', onPress: dismissCartMessage }}
        duration={3000}
        onDismiss={dismissCartMessage}
        visible={cartMessage !== null}
      >
        {cartMessage}
      </Snackbar>
    </>
  );
}
