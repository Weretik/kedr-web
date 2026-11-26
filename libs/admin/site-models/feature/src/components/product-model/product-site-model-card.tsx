import { SectionCard } from '@admin/shared/ui';
import { useGetSiteShowcaseQuery } from '@admin/site-models/data-access';
import { Alert, Button, Chip, CircularProgress, Link, Stack, Typography } from '@mui/material';

import { useSiteModelPanels } from '../panels/site-model-panels-context';

/**
 * «Модель на сайті» on a product page of «Товари» (spec 001 R-011): the product's model as a link, or «Без моделі»
 * with the shared «Додати в модель» and «Нова модель» panels. The showcase search finds the product by its 1C code.
 */
export function ProductSiteModelCard({ productId }: { productId: number }) {
  const panels = useSiteModelPanels();
  const query = useGetSiteShowcaseQuery({ search: String(productId), page: 1, pageSize: 20 });
  const product = query.data?.items
    .flatMap((row) => row.products)
    .find((item) => item.productId === productId);

  return (
    <SectionCard title="Модель на сайті">
      {query.isLoading ? (
        <CircularProgress aria-label="Завантаження моделі" size={24} />
      ) : query.isError ? (
        <Alert
          action={<Button onClick={() => void query.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити модель товару.
        </Alert>
      ) : !product ? (
        <Typography color="text.secondary">Товар не показується на сайті.</Typography>
      ) : product.model ? (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Link href={`/site-models/${product.model.id}`}>{product.model.name}</Link>
          {product.model.status === 'proposed' ? (
            <Chip color="info" label="Не перевірена" size="small" variant="outlined" />
          ) : null}
        </Stack>
      ) : (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography sx={{ mr: 1 }}>Без моделі</Typography>
          <Button onClick={() => panels.openAddToModel({ productId })} variant="contained">
            Додати в модель
          </Button>
          <Button
            onClick={() =>
              panels.openNewModel({
                productIds: [productId],
                name: product.name,
                categoryId: product.categoryId,
              })
            }
            variant="outlined"
          >
            Нова модель
          </Button>
        </Stack>
      )}
    </SectionCard>
  );
}
