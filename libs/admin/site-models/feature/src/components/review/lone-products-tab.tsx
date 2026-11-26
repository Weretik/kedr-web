import { useGetSiteShowcaseQuery } from '@admin/site-models/data-access';
import { LoneProductsGrid } from '@admin/site-models/ui';
import { Card } from '@mui/material';
import { useState } from 'react';

import { LoneProductAddToModel } from './lone-product-add-to-model';
import { useSiteModelPanels } from '../panels/site-model-panels-context';

/** «Товари без моделі» of «Перевірка» (spec 001 R-008): add each product to a model or start a new one. */
export function LoneProductsTab({ onNotice }: { onNotice: (text: string) => void }) {
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 });
  const panels = useSiteModelPanels();
  const showcase = useGetSiteShowcaseQuery({ status: 'none', ...paging });
  const rows = showcase.data?.items.flatMap((row) => row.products) ?? [];

  return (
    <Card sx={{ p: 0 }} variant="outlined">
      <LoneProductsGrid
        error={showcase.isError}
        loading={showcase.isFetching}
        onNewModel={(product) =>
          panels.openNewModel({
            productIds: [product.productId],
            name: product.name,
            categoryId: product.categoryId,
          })
        }
        onPageChange={(page, pageSize) => setPaging({ page, pageSize })}
        onRetry={() => void showcase.refetch()}
        page={paging.page}
        pageSize={paging.pageSize}
        renderAddToModel={(product) => (
          <LoneProductAddToModel onNotice={onNotice} product={product} />
        )}
        rowCount={showcase.data?.totalCount ?? 0}
        rows={rows}
      />
    </Card>
  );
}
