import { ProductDetailsScreen } from '@mobile/catalog/feature';
import { useConnectivity } from '@mobile/core/shell';
import { router, Stack, useLocalSearchParams } from 'expo-router';

export default function ProductDetailsRoute() {
  const { productSlug } = useLocalSearchParams<{ productSlug?: string | string[] }>();
  const normalizedSlug = Array.isArray(productSlug) ? productSlug[0] : productSlug;
  const connectivity = useConnectivity();

  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: 'Товар' }} />
      <ProductDetailsScreen
        isOnline={connectivity?.isOnline}
        onBack={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)/catalog'))}
        productSlug={normalizedSlug}
      />
    </>
  );
}
