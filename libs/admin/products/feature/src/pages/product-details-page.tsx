import { useGetAdminProductDetailsQuery } from '@admin/products/data-access';
import { ProductDetailsContent } from '@admin/products/ui';
import { appConfig } from '@admin/shared/config';
import {
  AdminDetailHeader,
  ChangeSlugDialog,
  NoticeSnackbar,
  PageLoader,
  PublicAddressCard,
} from '@admin/shared/ui';
import { Alert, Button, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { useProductSlugChange } from '../hooks/use-product-slug-change';
import { addProductFeedback } from '../model/add-product-feedback';

import type { AddProductFeedback } from '../model/add-product-feedback';
import type { AddProductResult } from '../products.routes';

const photoStorageUrl = 'https://images-kedr.cdn.express/~/o/products';
const publicPathPrefix = '/uk/product/';

export function ProductDetailsPage({
  canEditSlug = false,
  onAddProduct,
}: {
  canEditSlug?: boolean;
  onAddProduct?: (productId: number) => AddProductResult;
}) {
  const { productSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [notice, setNotice] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [addFeedback, setAddFeedback] = useState<AddProductFeedback | null>(null);
  const slug = productSlug?.trim() ?? '';
  const validSlug = slug.length > 0 && slug.length <= 255 && !slug.includes('/');
  const query = useGetAdminProductDetailsQuery(slug, { skip: !validSlug });
  const error = query.error as { code?: string; status?: number } | undefined;
  const notFound = error?.code === 'NotFound' || error?.status === 404;
  const slugChange = useProductSlugChange(query.data?.id, (newSlug) => {
    setNotice(`Нова адреса: ${newSlug}`);
    navigate(`/catalog/${encodeURIComponent(newSlug)}${location.search}`, { replace: true });
  });
  const publicUrl =
    query.data?.exportToSite && query.data.productSlug.trim()
      ? `${appConfig.storefrontBaseUrl.replace(/\/$/, '')}/uk/catalog/product/${encodeURIComponent(query.data.productSlug)}`
      : null;

  useEffect(() => {
    headingRef.current?.focus();
  }, [slug, query.isLoading]);

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel="Назад до товарів"
        backTo={`/catalog${location.search}`}
        headingRef={headingRef}
        title="Деталі товару"
      />
      {addFeedback && (
        <Alert onClose={() => setAddFeedback(null)} severity={addFeedback.severity}>
          {addFeedback.message}
        </Alert>
      )}
      {!validSlug || notFound ? (
        <Alert severity="info">Товар за цим посиланням не знайдено.</Alert>
      ) : query.isLoading ? (
        <PageLoader label="Завантаження товару" />
      ) : query.isError ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити товар. Спробуйте ще раз.
        </Alert>
      ) : query.data ? (
        <>
          <ProductDetailsContent
            product={query.data}
            publicUrl={publicUrl}
            photoStorageUrl={photoStorageUrl}
            onAddProduct={
              onAddProduct
                ? (id) => setAddFeedback(addProductFeedback(onAddProduct(id)))
                : undefined
            }
          />
          <PublicAddressCard
            onEdit={canEditSlug ? slugChange.openDialog : undefined}
            pathPrefix={publicPathPrefix}
            slug={query.data.productSlug}
          />
          <ChangeSlugDialog
            currentSlug={query.data.productSlug}
            error={slugChange.error}
            onClose={slugChange.close}
            onSubmit={(input) => void slugChange.submit(input)}
            open={slugChange.open}
            pathPrefix={publicPathPrefix}
            saving={slugChange.saving}
          />
        </>
      ) : (
        <Alert severity="info">Деталі товару недоступні.</Alert>
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default ProductDetailsPage;
