import { useGetAdminCategoriesQuery } from '@admin/categories/data-access';
import { CategoriesDataGrid } from '@admin/categories/ui';
import { AdminPageHeader } from '@admin/shared/ui';
import { Card, Stack, Tab, Tabs } from '@mui/material';
import { useSearchParams } from 'react-router-dom';

import { CategoryExplorer } from '../components/category-explorer';

type CategoriesTab = 'active' | 'deleted';

/**
 * Categories from 1C as a tree with the selected category beside it; the «Видалені» tab and editing
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

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader title="Категорії" />
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
    </Stack>
  );
}

export default CategoriesPage;
