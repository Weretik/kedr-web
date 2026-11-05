import { useAddToCalculation } from '@mobile/calculation/feature';
import { ProductScreen } from '@mobile/catalog/feature';
import { useConnectivity, WorkScreen } from '@mobile/core/shell';
import { IconButton } from '@mobile/shared/ui';
import { router, useLocalSearchParams } from 'expo-router';

export default function ProductRoute() {
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const isOnline = useConnectivity()?.isOnline ?? null;
  const addToCalculation = useAddToCalculation();

  return (
    <WorkScreen
      headerRight={
        <IconButton
          accessibilityLabel="До списку товарів"
          icon="format-list-bulleted"
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/products'))}
          variant="outlined"
        />
      }
      title="Товар"
    >
      <ProductScreen isOnline={isOnline} onAdd={addToCalculation} productId={Number(productId)} />
    </WorkScreen>
  );
}
