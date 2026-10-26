import { MissingPhotoProductsScreen } from '@mobile/catalog/feature';
import { ThemePreferenceHeaderControl } from '@mobile/core/shell';
import { router, Tabs } from 'expo-router';

export default function ProfileRoute() {
  return (
    <>
      <Tabs.Screen options={{ headerRight: () => <ThemePreferenceHeaderControl /> }} />
      <MissingPhotoProductsScreen
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
