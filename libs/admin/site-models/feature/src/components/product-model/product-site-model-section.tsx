import { ProductSiteModelCard } from './product-site-model-card';
import { SiteModelPanelsProvider } from '../panels/site-model-panels-provider';

/** The «Модель на сайті» block with its own panels, for the product page the app composes into «Товари». */
export function ProductSiteModelSection({ productId }: { productId: number }) {
  return (
    <SiteModelPanelsProvider>
      <ProductSiteModelCard productId={productId} />
    </SiteModelPanelsProvider>
  );
}
