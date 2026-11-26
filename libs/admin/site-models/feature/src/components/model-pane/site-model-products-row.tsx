import { useGetSiteModelQuery } from '@admin/site-models/data-access';
import { SiteModelProductsPreview } from '@admin/site-models/ui';

/** The products of a model opened by its arrow in «Моделі», read from the model (spec 001 R-002a). */
export function SiteModelProductsRow({ modelId }: { modelId: number }) {
  const query = useGetSiteModelQuery(modelId);
  return (
    <SiteModelProductsPreview
      error={query.isError}
      loading={query.isLoading}
      onRetry={() => void query.refetch()}
      products={query.data?.products}
    />
  );
}
