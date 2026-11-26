import { useGetAdminCategoriesQuery } from '@admin/categories/data-access';
import { CategoriesDataGrid } from '@admin/categories/ui';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import { Card, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { CategoryTreeTable } from '../components/list/category-tree-table';
import { NewCategoryFlow } from '../components/list/new-category-flow';

type CategoriesTab = 'active' | 'deleted';

/**
 * Categories as one tree table (spec 003 R-001), «Нова категорія» for editors; the «Видалені» tab and changes exist for
 * administrators only.
 */
export function CategoriesPage({
  canEdit = false,
  canSeeDeleted,
}: {
  canEdit?: boolean;
  canSeeDeleted: boolean;
}) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: CategoriesTab =
    canSeeDeleted && searchParams.get('tab') === 'deleted' ? 'deleted' : 'active';
  const query = useGetAdminCategoriesQuery({ deleted: tab === 'deleted' });
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          canEdit && tab === 'active' ? (
            <NewCategoryFlow
              categories={query.data ?? []}
              onCreated={(categoryId) =>
                navigate(`/categories/${categoryId}`, {
                  state: { notice: 'Категорію створено.' },
                })
              }
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
        <CategoryTreeTable
          canEdit={canEdit}
          categories={query.data ?? []}
          error={query.isError}
          loading={query.isLoading}
          onNotice={setNotice}
          onRetry={() => query.refetch()}
        />
      )}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default CategoriesPage;
