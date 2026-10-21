import { useGetAdminProductDetailsQuery } from '@admin/products/data-access';
import { ProductDetailsContent } from '@admin/products/ui';
import { appConfig } from '@admin/shared/config';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Button, Card, CardContent, CircularProgress, Link as MuiLink, Stack, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

import type { AddProductResult } from '../products.routes';

const photoStorageUrl = 'https://images-kedr.cdn.express/~/o/products';

export function ProductDetailsPage({ onAddProduct }: { onAddProduct?: (productId: number) => AddProductResult }) {
  const { productSlug } = useParams();
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [addFeedback, setAddFeedback] = useState<{ message: string; severity: 'info' | 'warning' } | null>(null);
  const slug = productSlug?.trim() ?? '';
  const validSlug = slug.length > 0 && slug.length <= 255 && !slug.includes('/');
  const query = useGetAdminProductDetailsQuery(slug, { skip: !validSlug });
  const error = query.error as { code?: string; status?: number } | undefined;
  const notFound = error?.code === 'NotFound' || error?.status === 404;
  const publicUrl = query.data?.exportToSite && query.data.productSlug.trim()
    ? `${appConfig.storefrontBaseUrl.replace(/\/$/, '')}/uk/catalog/product/${encodeURIComponent(query.data.productSlug)}`
    : null;

  useEffect(() => { headingRef.current?.focus(); }, [slug, query.isLoading]);

  return (
    <Stack component="section" spacing={3}>
      <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
        <MuiLink component={RouterLink} to={`/catalog${location.search}`} underline="hover" sx={{ alignItems: 'center', display: 'inline-flex', gap: 0.75 }}>
          <ArrowBackIcon fontSize="small" />Назад до товарів
        </MuiLink>
        <Typography component="h1" ref={headingRef} tabIndex={-1} variant="h4">Деталі товару</Typography>
      </Stack>
      {addFeedback && <Alert onClose={() => setAddFeedback(null)} severity={addFeedback.severity}>{addFeedback.message}</Alert>}
      {!validSlug || notFound ? (
        <Alert severity="info">Товар за цим посиланням не знайдено.</Alert>
      ) : query.isLoading ? (
        <Card><CardContent><CircularProgress aria-label="Завантаження товару" /></CardContent></Card>
      ) : query.isError ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити товар. Спробуйте ще раз.
        </Alert>
      ) : query.data ? (
        <ProductDetailsContent product={query.data} publicUrl={publicUrl} photoStorageUrl={photoStorageUrl} onAddProduct={onAddProduct ? (id) => {
          const result = onAddProduct(id);
          setAddFeedback(result === 'saved' ? { message: 'Товар додано до поточного набору замовлення.', severity: 'info' } : result === 'volatile' ? { message: 'Товар додано лише в цій вкладці. Браузер не зберіг набір; після закриття вкладки зміни можуть зникнути.', severity: 'warning' } : { message: 'Не вдалося додати товар. Перевірте ліміт позицій і кількість.', severity: 'warning' });
        } : undefined} />
      ) : (
        <Alert severity="info">Деталі товару недоступні.</Alert>
      )}
    </Stack>
  );
}

export default ProductDetailsPage;
