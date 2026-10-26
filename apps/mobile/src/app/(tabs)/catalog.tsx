import { CatalogScreen } from '@mobile/catalog/feature';
import { router, Tabs } from 'expo-router';

export default function CatalogRoute() {
  return (
    <>
      <Tabs.Screen options={{ headerShown: false }} />
      <CatalogScreen
        onProductPress={(product) =>
          router.push({
            pathname: '/product/[productSlug]',
            params: { productSlug: product.productSlug },
          })
        }
      />
    </>
  );
}
