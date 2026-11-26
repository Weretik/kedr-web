import { descendantCount } from '@admin/categories/model';
import {
  CategorySiteVisibilityDialog,
  CategoryTreeGrid,
  CategoryTreeToolbar,
} from '@admin/categories/ui';
import { Card, Stack } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCategorySiteVisibility } from '../../hooks/tree/use-category-site-visibility';
import { useCategoryTableView } from '../../hooks/tree/use-category-table-view';

import type { AdminCategory } from '@admin/categories/model';

interface CategoryTreeTableProps {
  categories: readonly AdminCategory[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  /** Administrators flip «На сайті» in the row. */
  canEdit: boolean;
  onNotice: (message: string) => void;
}

/** The active categories as one tree table with search, chips and the row switch (spec 003 R-001…R-004). */
export function CategoryTreeTable(props: CategoryTreeTableProps) {
  const navigate = useNavigate();
  const view = useCategoryTableView(props.categories);
  const visibility = useCategorySiteVisibility(props.onNotice);
  const byId = useMemo(
    () => new Map(props.categories.map((row) => [row.id, row])),
    [props.categories],
  );

  return (
    <Stack spacing={2}>
      <CategoryTreeToolbar
        allOpen={view.allOpen}
        counts={view.counts}
        filtering={view.filtering}
        filters={view.filters}
        onFilterToggle={view.toggleFilter}
        onSearchChange={view.setSearch}
        onToggleAll={view.toggleAll}
        search={view.search}
      />
      <Card sx={{ overflow: 'hidden' }} variant="outlined">
        <CategoryTreeGrid
          emptyMessage={
            view.filtering
              ? 'Нічого не знайдено. Змініть пошук або фільтри.'
              : 'Категорій ще немає: вони з’являться після обміну з 1С.'
          }
          error={props.error}
          loading={props.loading}
          onOpen={(categoryId) => navigate(`/categories/${categoryId}`)}
          onRetry={props.onRetry}
          onToggleOpen={view.toggleOpen}
          onToggleSite={props.canEdit ? visibility.ask : undefined}
          rows={view.rows}
        />
      </Card>
      {visibility.target ? (
        <CategorySiteVisibilityDialog
          category={visibility.target}
          descendantCount={descendantCount(props.categories, visibility.target.id, byId)}
          error={visibility.error}
          onCancel={visibility.cancel}
          onConfirm={() => void visibility.confirm()}
          submitting={visibility.submitting}
        />
      ) : null}
    </Stack>
  );
}
