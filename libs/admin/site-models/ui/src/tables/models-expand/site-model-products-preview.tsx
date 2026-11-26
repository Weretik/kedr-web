import { StatusPill } from '@admin/shared/ui';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';

import { ProductThumb } from '../../components/display/product-thumb';

import type { SiteModelProduct } from '@admin/site-models/model';

interface SiteModelProductsPreviewProps {
  products: readonly SiteModelProduct[] | undefined;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

const price = (value: number | null) =>
  value === null ? '—' : `${value.toLocaleString('uk-UA')} грн`;

/** The products of an opened model under its row in «Моделі»: photo, name, code, price, and whether the site shows it. */
export function SiteModelProductsPreview({
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
    <Stack
      component="ul"
      spacing={0.5}
      sx={{ listStyle: 'none', m: 0, pl: 7, py: 1, width: '100%' }}
    >
      {products.map((product) => (
        <Box
          component="li"
          key={product.productId}
          sx={{
            alignItems: 'center',
            display: 'grid',
            gap: 1.5,
            gridTemplateColumns: '40px minmax(0, 1fr) auto auto',
          }}
        >
          <ProductThumb size={40} src={product.photo} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ overflowWrap: 'anywhere' }} variant="body2">
              {product.name}
            </Typography>
            <Typography color="text.secondary" variant="caption">
              Код {product.productId}
            </Typography>
          </Box>
          <Typography sx={{ fontVariantNumeric: 'tabular-nums' }} variant="body2">
            {price(product.retailPrice)}
          </Typography>
          {product.exportToSite ? (
            <StatusPill label="На сайті" tone="success" />
          ) : (
            <StatusPill label="Не на сайті" tone="neutral" />
          )}
        </Box>
      ))}
    </Stack>
  );
}
