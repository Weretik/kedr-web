import { MissingPhotoProductsContent } from '../components/missing-photo-products-content';
import { useMissingPhotoProductsController } from '../hooks/use-missing-photo-products-controller';

import type { CatalogProduct } from '@mobile/catalog/model';

export interface MissingPhotoProductsScreenProps {
  onProductPress: (product: CatalogProduct) => void;
}

export function MissingPhotoProductsScreen({
  onProductPress,
}: Readonly<MissingPhotoProductsScreenProps>) {
  const controller = useMissingPhotoProductsController();
  return <MissingPhotoProductsContent {...controller} onProductPress={onProductPress} />;
}
