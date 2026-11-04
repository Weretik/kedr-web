import { useGetAdminCategoriesQuery } from '@admin/categories/data-access';
import { orderCategoryTree } from '@admin/categories/model';
import { CategoriesDataGrid } from '@admin/categories/ui';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Card, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CategoryEditPanel } from '../components/category-edit-panel';

import type { AdminCategory } from '@admin/categories/model';

type CategoriesTab = 'active' | 'deleted';

/** Category list; the «Видалені» tab and the edit pencil exist for administrators only (R-002). */
export function CategoriesPage({
  canEdit = false,
  canSeeDeleted,
}: {
  canEdit?: boolean;
  canSeeDeleted: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<number | undefined>();
  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const tab: CategoriesTab =
    canSeeDeleted && searchParams.get('tab') === 'deleted' ? 'deleted' : 'active';
  const query = useGetAdminCategoriesQuery({ deleted: tab === 'deleted' });
  // Deleted rows come newest first from the server; active rows are shown as a tree.
  const rows = useMemo(
    () => (tab === 'deleted' ? (query.data ?? []) : orderCategoryTree(query.data ?? [])),
    [query.data, tab],
  );
  const viewCategory = useCallback(
    (category: AdminCategory) => navigate(`/categories/${category.id}`),
    [navigate],
  );
  const editCategory = useCallback((category: AdminCategory) => {
    setEditingId(category.id);
    setEditOpen(true);
  }, []);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Категорії" />
      <Typography color="text.secondary" variant="body2">
        Дерево категорій приходить з 1С. Адресу на сайті й тексти сторінки категорії змінюють у
        панелі редагування.
      </Typography>
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        {canSeeDeleted ? (
          <Tabs
            aria-label="Режим списку категорій"
            onChange={(_event, value: CategoriesTab) =>
              setSearchParams(value === 'deleted' ? { tab: 'deleted' } : {})
            }
            sx={{ borderBottom: 1, borderColor: 'divider', px: { xs: 1, sm: 3 } }}
            value={tab}
          >
            <Tab label="Активні" value="active" />
            <Tab label="Видалені" value="deleted" />
          </Tabs>
        ) : null}
        <CategoriesDataGrid
          error={query.isError}
          loading={query.isFetching}
          mode={tab}
          onEdit={canEdit ? editCategory : undefined}
          onRetry={() => query.refetch()}
          onView={viewCategory}
          rows={rows}
        />
      </Card>
      {canEdit ? (
        <CategoryEditPanel
          categoryId={editingId}
          onClose={() => setEditOpen(false)}
          onNotice={setNotice}
          open={editOpen}
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CategoriesPage;
