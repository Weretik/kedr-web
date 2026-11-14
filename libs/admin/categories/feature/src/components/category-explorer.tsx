import { useGetCategoryContentQuery } from '@admin/categories/data-access';
import { childCategoriesOf, descendantCount } from '@admin/categories/model';
import {
  CategoryOverviewCard,
  CategorySiteVisibilityDialog,
  CategoryTreeNav,
} from '@admin/categories/ui';
import { NoticeSnackbar } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';
import { useRef, useState } from 'react';

import { CategoryEditPanel } from './category-edit-panel';
import { useCategorySiteVisibility } from '../hooks/explorer/use-category-site-visibility';
import { useCategoryTreeView } from '../hooks/explorer/use-category-tree-view';

import type { AdminCategory } from '@admin/categories/model';

const publicPathPrefix = '/uk/catalog/';
const phoneQuery = '(max-width: 899.95px)';

interface CategoryExplorerProps {
  categories: readonly AdminCategory[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  canEdit: boolean;
}

/** «Провідник» layout of the category list: the tree on the left, the selected category on the right. */
export function CategoryExplorer({
  canEdit,
  categories,
  error,
  loading,
  onRetry,
}: CategoryExplorerProps) {
  const view = useCategoryTreeView(categories);
  const { selected } = view;
  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const visibility = useCategorySiteVisibility(selected, setNotice);
  const overviewRef = useRef<HTMLDivElement>(null);
  const contentQuery = useGetCategoryContentQuery(selected?.id ?? 0, { skip: !selected });

  const select = (categoryId: number) => {
    view.select(categoryId);
    // On phones the overview is under the tree; bring it into view.
    if (window.matchMedia?.(phoneQuery).matches)
      overviewRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Box
      sx={{
        alignItems: 'start',
        display: 'grid',
        gap: 3,
        gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(260px, 340px) minmax(0, 1fr)' },
      }}
    >
      <CategoryTreeNav
        error={error}
        expandedIds={view.expandedIds}
        loading={loading}
        missingTextCount={view.missingTextCount}
        onOnlyMissingTextChange={view.setOnlyMissingText}
        onlyMissingText={view.onlyMissingText}
        onExpandedChange={view.setExpanded}
        onRetry={onRetry}
        onSearchChange={view.setSearch}
        onSelect={select}
        search={view.search}
        selectedId={selected?.id}
        tree={view.tree}
      />
      <Box ref={overviewRef} sx={{ minWidth: 0, scrollMarginTop: 88 }}>
        {selected ? (
          <CategoryOverviewCard
            ancestors={view.ancestors}
            category={selected}
            childCategories={childCategoriesOf(categories, selected.id)}
            content={contentQuery.data}
            contentError={contentQuery.isError}
            contentLoading={contentQuery.isLoading}
            detailsHref={`/categories/${selected.id}?category=${selected.id}`}
            onEdit={canEdit ? () => setEditOpen(true) : undefined}
            onToggleSite={canEdit ? visibility.ask : undefined}
            onRetryContent={() => contentQuery.refetch()}
            onSelect={select}
            pathPrefix={publicPathPrefix}
          />
        ) : loading || error ? null : (
          <Typography color="text.secondary" variant="body2">
            Категорій ще немає: вони з’являться після обміну з 1С.
          </Typography>
        )}
      </Box>
      {canEdit ? (
        <CategoryEditPanel
          categoryId={selected?.id}
          onClose={() => setEditOpen(false)}
          onNotice={setNotice}
          open={editOpen}
        />
      ) : null}
      {visibility.open && selected ? (
        <CategorySiteVisibilityDialog
          category={selected}
          descendantCount={descendantCount(categories, selected.id, view.byId)}
          error={visibility.error}
          onCancel={visibility.cancel}
          onConfirm={() => void visibility.confirm()}
          submitting={visibility.submitting}
        />
      ) : null}
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}
