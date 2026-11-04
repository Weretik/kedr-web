import {
  useGetAdminCategoriesQuery,
  useGetAdminCategoryQuery,
  useGetCategoryContentQuery,
} from '@admin/categories/data-access';
import { categoryPath } from '@admin/categories/model';
import { CategoryInformationCard } from '@admin/categories/ui';
import { AdminDetailHeader, NoticeSnackbar, PageLoader, PublicAddressCard } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Box, Button, Stack } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { CategoryContentSection } from '../components/category-content-section';
import { CategoryEditPanel } from '../components/category-edit-panel';

const publicPathPrefix = '/uk/catalog/';

/** Read-only category page; «Редагувати» opens the edit panel for administrators. */
export function CategoryDetailsPage({ canEdit }: { canEdit: boolean }) {
  const params = useParams();
  const location = useLocation();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const categoryId = Number(params['categoryId']);
  const validId = Number.isInteger(categoryId) && categoryId > 0;
  const categoryQuery = useGetAdminCategoryQuery(categoryId, { skip: !validId });
  const contentQuery = useGetCategoryContentQuery(categoryId, { skip: !validId });
  // The list is usually cached from the previous page; it only feeds the path line.
  const listQuery = useGetAdminCategoriesQuery({ deleted: false }, { skip: !validId });
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
        actions={
          canEdit && category ? (
            <Button
              onClick={() => setEditing(true)}
              startIcon={<EditOutlinedIcon />}
              variant="contained"
            >
              Редагувати
            </Button>
          ) : undefined
        }
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
            <PublicAddressCard pathPrefix={publicPathPrefix} slug={category.slug} />
          </Box>
          <CategoryContentSection
            content={contentQuery.data}
            error={contentQuery.isError}
            loading={contentQuery.isLoading}
            onRetry={() => contentQuery.refetch()}
          />
          {canEdit ? (
            <CategoryEditPanel
              categoryId={category.id}
              onClose={() => setEditing(false)}
              onNotice={setNotice}
              open={editing}
            />
          ) : null}
        </>
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CategoryDetailsPage;
