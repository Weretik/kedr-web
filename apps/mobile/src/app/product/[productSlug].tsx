import { ProductDetailsScreen } from '@mobile/catalog/feature';
import { useConnectivity } from '@mobile/core/shell';
import { Stack, useLocalSearchParams } from 'expo-router';

export default function ProductDetailsRoute() {
  const { productSlug } = useLocalSearchParams<{ productSlug?: string | string[] }>();
  const normalizedSlug = Array.isArray(productSlug) ? productSlug[0] : productSlug;
  const connectivity = useConnectivity();

  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Товар' }} />
      <ProductDetailsScreen isOnline={connectivity?.isOnline} productSlug={normalizedSlug} />
    </>
  );
}
