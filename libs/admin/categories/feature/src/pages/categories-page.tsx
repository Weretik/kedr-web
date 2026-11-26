import { useGetAdminCategoriesQuery } from '@admin/categories/data-access';
import { CategoriesDataGrid } from '@admin/categories/ui';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Card, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CategoryExplorer } from '../components/explorer/category-explorer';
import { NewCategoryFlow } from '../components/placement/new-category-flow';

type CategoriesTab = 'active' | 'deleted';

/**
 * Categories as a tree with the selected category beside it, and «Нова категорія» for editors; the «Видалені» tab and editing
 * exist for administrators only (R-002).
 */
export function CategoriesPage({
  canEdit = false,
  canSeeDeleted,
}: {
  canEdit?: boolean;
  canSeeDeleted: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: CategoriesTab =
    canSeeDeleted && searchParams.get('tab') === 'deleted' ? 'deleted' : 'active';
  const query = useGetAdminCategoriesQuery({ deleted: tab === 'deleted' });
  const [notice, setNotice] = useState<string | null>(null);
  const selectedId = Number(searchParams.get('category')) || null;

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          canEdit && tab === 'active' ? (
            <NewCategoryFlow
              categories={query.data ?? []}
              onCreated={(categoryId) => {
                setSearchParams({ category: String(categoryId) });
                setNotice('Категорію створено.');
              }}
              selectedId={selectedId}
            />
          ) : undefined
        }
        title="Категорії"
      />
      {canSeeDeleted ? (
        <Tabs
          aria-label="Режим списку категорій"
          onChange={(_event, value: CategoriesTab) =>
            setSearchParams(value === 'deleted' ? { tab: 'deleted' } : {})
          }
          sx={{ borderBottom: 1, borderColor: 'divider', mt: -1 }}
          value={tab}
        >
          <Tab label="Активні" value="active" />
          <Tab label="Видалені" value="deleted" />
        </Tabs>
      ) : null}
      {tab === 'deleted' ? (
        <Card sx={{ overflow: 'hidden' }} variant="outlined">
          <CategoriesDataGrid
            error={query.isError}
            loading={query.isFetching}
            onRetry={() => query.refetch()}
            rows={query.data ?? []}
          />
        </Card>
      ) : (
        <CategoryExplorer
          canEdit={canEdit}
          categories={query.data ?? []}
          error={query.isError}
          loading={query.isLoading}
          onRetry={() => query.refetch()}
        />
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CategoriesPage;
