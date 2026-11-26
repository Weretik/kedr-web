import { AdminPageHeader } from '@admin/shared/ui';
import { SiteModelsDataGrid } from '@admin/site-models/ui';
import AddOutlined from '@mui/icons-material/AddOutlined';
import { Button, Card, Stack } from '@mui/material';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { SiteModelProductsRow } from '../components/model-pane/site-model-products-row';
import { useSiteModelPanels } from '../components/panels/site-model-panels-context';
import { useSiteModelsList } from '../hooks/lists/use-site-models-list';

import type { SiteModelListItem } from '@admin/site-models/model';

/**
 * «Моделі»: every site model in a server-paged grid, with search and filters in the address (spec 001 R-002); an arrow
 * opens a model's products under its row (R-002a). Managers
 * and Admins edit models alike, so the pencil is always there.
 */
export function SiteModelsPage() {
  const list = useSiteModelsList();
  const panels = useSiteModelPanels();
  const navigate = useNavigate();
  const location = useLocation();
  const view = useCallback(
    (model: SiteModelListItem) =>
      navigate(`/site-models/${model.id}`, { state: { listSearch: location.search } }),
    [location.search, navigate],
  );
  const { openEditModel } = panels;
  const edit = useCallback((model: SiteModelListItem) => openEditModel(model.id), [openEditModel]);
  const [openIds, setOpenIds] = useState<ReadonlySet<number>>(new Set());
  const toggleOpen = useCallback(
    (modelId: number) =>
      setOpenIds((current) => {
        const next = new Set(current);
        if (!next.delete(modelId)) next.add(modelId);
        return next;
      }),
    [],
  );
  const renderProducts = useCallback(
    (modelId: number) => <SiteModelProductsRow modelId={modelId} />,
    [],
  );

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <Button
            onClick={() => panels.openNewModel()}
            startIcon={<AddOutlined />}
            variant="contained"
          >
            Нова модель
          </Button>
        }
        title="Моделі"
      />
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <SiteModelsDataGrid
          emptyMessage={list.emptyMessage}
          errorMessage={list.error ? 'Не вдалося завантажити моделі.' : undefined}
          filters={{
            categories: list.categories,
            categoriesLoading: list.categoriesLoading,
            categoryId: list.state.categoryId,
            status: list.state.status,
            problem: list.state.problem,
            onCategoryChange: list.changeCategory,
            onStatusChange: list.changeStatus,
            onProblemChange: list.changeProblem,
          }}
          loading={list.loading}
          onEdit={edit}
          onPageChange={list.changePage}
          onPageSizeChange={list.changePageSize}
          onRetry={list.retry}
          onSearchChange={list.changeSearch}
          onToggleOpen={toggleOpen}
          onView={view}
          openIds={openIds}
          page={list.state.page}
          pageSize={list.state.pageSize}
          renderProducts={renderProducts}
          rowCount={list.rowCount}
          rows={list.rows}
          search={list.state.search}
        />
      </Card>
    </Stack>
  );
}

export default SiteModelsPage;
