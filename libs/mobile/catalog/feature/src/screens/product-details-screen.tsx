import { ProductDetailsState, ProductDetailsView } from '@mobile/catalog/ui';
import { ScreenHeader, useKedrTheme } from '@mobile/shared/ui';
import { View } from 'react-native';
import { Snackbar } from 'react-native-paper';

import { useProductDetailsController } from '../hooks/use-product-details-controller';

export interface ProductDetailsScreenProps {
  isOnline?: boolean;
  onBack?: () => void;
  productSlug?: string;
}

export function ProductDetailsScreen({
  isOnline = true,
  onBack,
  productSlug,
}: Readonly<ProductDetailsScreenProps>) {
  const theme = useKedrTheme();
  const { cartMessage, dismissCartMessage, pageState } = useProductDetailsController({
    isOnline,
    productSlug,
  });

  return (
    <>
      {pageState.kind === 'ready' ? (
        <ProductDetailsView {...pageState} onBack={onBack} />
      ) : (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
          <ScreenHeader onBack={onBack} title="Товар" />
          <ProductDetailsState {...pageState} />
        </View>
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
