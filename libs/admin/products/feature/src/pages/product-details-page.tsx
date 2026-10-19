import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useGetAdminProductDetailsQuery } from '@admin/products/data-access';
import { ProductDetailsContent } from '@admin/products/ui';
import { appConfig } from '@admin/shared/config';
import { Alert, Button, Card, CardContent, CircularProgress, Link as MuiLink, Stack, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import { Link as RouterLink, useLocation, useParams } from 'react-router-dom';

const photoStorageUrl = 'https://images-kedr.cdn.express/~/o/products';

export function ProductDetailsPage() {
  const { productSlug } = useParams();
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
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
      {!validSlug || notFound ? (
        <Alert severity="info">Товар за цим посиланням не знайдено.</Alert>
      ) : query.isLoading ? (
        <Card><CardContent><CircularProgress aria-label="Завантаження товару" /></CardContent></Card>
      ) : query.isError ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити товар. Спробуйте ще раз.
        </Alert>
      ) : query.data ? (
        <ProductDetailsContent product={query.data} publicUrl={publicUrl} photoStorageUrl={photoStorageUrl} />
      ) : (
        <Alert severity="info">Деталі товару недоступні.</Alert>
      )}
    </Stack>
  );
}

export default ProductDetailsPage;
