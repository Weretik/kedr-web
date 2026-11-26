import {
  useGetCatalogSeoReviewQuery,
  useGetContentSeoReviewQuery,
} from '@admin/seo-review/data-access';
import { useMemo } from 'react';

import type { SeoReviewItem, SeoReviewKind } from '@admin/seo-review/model';

const noItems: readonly SeoReviewItem[] = [];

/**
 * Both module reviews as one list. Catalog pages are reviewed only for roles that may edit them
 * (Seo, Admin); a manager sees articles only, as the backend policies allow.
 */
export function useSeoReview(canEditCatalog: boolean) {
  const catalog = useGetCatalogSeoReviewQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: !canEditCatalog,
  });
  const content = useGetContentSeoReviewQuery(undefined, { refetchOnMountOrArgChange: true });

  const catalogItems = catalog.data ?? noItems;
  const contentItems = content.data ?? noItems;
  const items = useMemo(() => [...catalogItems, ...contentItems], [catalogItems, contentItems]);
  const kinds: SeoReviewKind[] = canEditCatalog ? ['category', 'model', 'article'] : ['article'];

  return {
    error: catalog.isError || content.isError,
    items,
    kinds,
    loading: catalog.isFetching || content.isFetching,
    retry: () => {
      if (canEditCatalog) void catalog.refetch();
      void content.refetch();
    },
  };
}
