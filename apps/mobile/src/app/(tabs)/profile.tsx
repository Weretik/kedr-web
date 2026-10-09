import { MissingPhotoProductsScreen } from '@mobile/catalog/feature';
import { router } from 'expo-router';

export default function ProfileRoute() {
  return (
    <MissingPhotoProductsScreen
      onProductPress={(product) =>
        router.push({
          pathname: '/product/[productSlug]',
          params: { productSlug: product.productSlug },
        })
      }
    />
  );
}
