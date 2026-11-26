import { Alert, Button, Skeleton, Stack, Typography } from '@mui/material';

import { SiteModelPreviewItem } from './site-model-preview-item';

import type { SiteModelPreviewEditing } from './site-model-preview-item';
import type { SiteModelProduct } from '@admin/site-models/model';

interface SiteModelProductsPreviewProps {
  products: readonly SiteModelProduct[] | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  /** The switcher pickers and «Усі ознаки» for each product (R-002b); without it the list only shows. */
  editing?: SiteModelPreviewEditing;
}

/** The products of an opened model under its row in «Моделі» (spec 001 R-002a, R-002b). */
export function SiteModelProductsPreview({
  editing,
  error,
  loading,
  onRetry,
  products,
}: SiteModelProductsPreviewProps) {
  if (loading)
    return (
      <Skeleton aria-label="Завантаження товарів" height={56} sx={{ my: 1 }} variant="rounded" />
    );
  if (error || !products)
    return (
      <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error" sx={{ my: 1 }}>
        Не вдалося завантажити товари моделі.
      </Alert>
    );
  if (products.length === 0)
    return (
      <Typography color="text.secondary" sx={{ py: 1.5 }} variant="body2">
        У моделі немає товарів.
      </Typography>
    );

  return (
    // The grid would take typing and arrows in a picker as its own navigation.
    <Stack
      onKeyDown={(event) => event.stopPropagation()}
      spacing={1}
      sx={{ pl: 7, py: 1, width: '100%' }}
    >
      {editing?.error ? <Alert severity="error">{editing.error}</Alert> : null}
      <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {products.map((product) => (
          <SiteModelPreviewItem editing={editing} key={product.productId} product={product} />
        ))}
      </Stack>
    </Stack>
  );
}
