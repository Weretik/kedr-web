import {
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useGetCategoryContentQuery,
} from '@admin/categories/data-access';
import { categoryPath } from '@admin/categories/model';
import { CategoryInformationCard } from '@admin/categories/ui';
import {
  AdminDetailHeader,
  ChangeSlugDialog,
  NoticeSnackbar,
  PageLoader,
  PublicAddressCard,
} from '@admin/shared/ui';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { CategoryContentSection } from '../components/category-content-section';
import { useCategoryContentEditor } from '../hooks/use-category-content-editor';
import { useCategorySlugChange } from '../hooks/use-category-slug-change';

const publicPathPrefix = '/uk/catalog/';

export function CategoryDetailsPage({ canEdit }: { canEdit: boolean }) {
  const params = useParams();
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const categoryId = Number(params['categoryId']);
  const validId = Number.isInteger(categoryId) && categoryId > 0;
  const categoryQuery = useGetAdminCategoryQuery(categoryId, { skip: !validId });
  const contentQuery = useGetCategoryContentQuery(categoryId, { skip: !validId });
  // The list is usually cached from the previous page; it only feeds the path line.
  const listQuery = useGetAdminCategoriesQuery({ deleted: false }, { skip: !validId });
  const editor = useCategoryContentEditor(categoryId, contentQuery.data, setNotice);
  const slugChange = useCategorySlugChange(categoryId, setNotice);
  const notFound = (categoryQuery.error as { code?: string } | undefined)?.code === 'NotFound';
  const category = categoryQuery.data;

  const path = useMemo(() => {
    if (!category) return [];
    const byId = new Map((listQuery.data ?? []).map((row) => [row.id, row]));
    return categoryPath(category, byId.set(category.id, category));
  }, [category, listQuery.data]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [categoryId]);

  return (
    <Stack component="section" spacing={3}>
      <AdminDetailHeader
        backLabel="Назад до категорій"
        backTo={`/categories${location.search}`}
        headingRef={headingRef}
        title="Деталі категорії"
      />
      {!validId || notFound ? (
        <Alert severity="info">
          Категорію не знайдено: можливо, її видалено під час обміну з 1С.
        </Alert>
      ) : categoryQuery.isLoading ? (
        <PageLoader label="Завантаження категорії" />
      ) : categoryQuery.isError || !category ? (
        <Alert
          action={<Button onClick={() => categoryQuery.refetch()}>Повторити</Button>}
          severity="error"
        >
          Не вдалося завантажити категорію. Спробуйте ще раз.
        </Alert>
      ) : (
        <>
          <Box
            sx={{
              alignItems: 'start',
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 2fr) minmax(0, 1fr)' },
            }}
          >
            <CategoryInformationCard category={category} path={path} />
            <PublicAddressCard
              onEdit={canEdit ? slugChange.openDialog : undefined}
              pathPrefix={publicPathPrefix}
              slug={category.slug}
            />
          </Box>
          <CategoryContentSection
            canEdit={canEdit}
            content={contentQuery.data}
            editor={editor}
            error={contentQuery.isError}
            loading={contentQuery.isLoading}
            onRetry={() => contentQuery.refetch()}
          />
          <ChangeSlugDialog
            currentSlug={category.slug}
            error={slugChange.error}
            onClose={slugChange.close}
            onSubmit={(input) => void slugChange.submit(input)}
            open={slugChange.open}
            pathPrefix={publicPathPrefix}
            saving={slugChange.saving}
          />
        </>
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CategoryDetailsPage;
