import { useGetCategoryContentQuery } from '@admin/categories/data-access';
import {
  buildCategoryTree,
  categoryAncestorIds,
  filterCategoryTree,
  missingContentLanguages,
} from '@admin/categories/model';
import { CategoryOverviewCard, CategoryTreeNav } from '@admin/categories/ui';
import { NoticeSnackbar } from '@admin/shared/ui';
import { Box, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { CategoryEditPanel } from './category-edit-panel';

import type { AdminCategory, CategoryTreeNode } from '@admin/categories/model';

const publicPathPrefix = '/uk/catalog/';

interface CategoryExplorerProps {
  categories: readonly AdminCategory[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  canEdit: boolean;
}

const hasMissingText = (category: AdminCategory) =>
  (missingContentLanguages(category)?.length ?? 0) > 0;

const collectIds = (nodes: readonly CategoryTreeNode[], into: string[] = []) => {
  for (const node of nodes) {
    if (node.children.length > 0) into.push(String(node.category.id));
    collectIds(node.children, into);
  }
  return into;
};

/**
 * «Провідник» layout of the category list: the tree on the left, the selected category on the
 * right. The selection lives in `?category=` so a link or the back button returns to it.
 */
export function CategoryExplorer({
  canEdit,
  categories,
  error,
  loading,
  onRetry,
}: CategoryExplorerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [onlyMissingText, setOnlyMissingText] = useState(false);
  const [expanded, setExpanded] = useState<string[] | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const overviewRef = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => new Map(categories.map((row) => [row.id, row])), [categories]);
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const filtered = useMemo(
    () => filterCategoryTree(tree, search, onlyMissingText ? hasMissingText : undefined),
    [tree, search, onlyMissingText],
  );
  const missingTextCount = useMemo(() => categories.filter(hasMissingText).length, [categories]);
  const filtering = Boolean(search.trim()) || onlyMissingText;

  const requestedId = Number(searchParams.get('category'));
  const selected = byId.get(requestedId) ?? tree[0]?.category;
  const ancestorIds = useMemo(
    () => (selected ? categoryAncestorIds(selected.id, byId) : []),
    [byId, selected],
  );

  // Until the person expands or collapses something, the path to the selected category is open.
  const expandedIds = filtering ? collectIds(filtered.tree) : (expanded ?? ancestorIds.map(String));

  const contentQuery = useGetCategoryContentQuery(selected?.id ?? 0, { skip: !selected });

  const select = (categoryId: number) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.set('category', String(categoryId));
        return next;
      },
      { replace: true },
    );
    // Opening a category from the overview keeps its path visible in the tree.
    setExpanded((current) => {
      const path = categoryAncestorIds(categoryId, byId).map(String);
      const base = current ?? ancestorIds.map(String);
      return [...new Set([...base, ...path])];
    });
    // On phones the overview is under the tree; bring it into view.
    if (window.matchMedia?.('(max-width: 899.95px)').matches)
      overviewRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  };

  const childCategories = useMemo(
    () =>
      categories
        .filter((row) => selected !== undefined && row.parentId === selected.id)
        .sort((left, right) => left.sortOrder - right.sortOrder || left.id - right.id),
    [categories, selected],
  );

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
        expandedIds={expandedIds}
        loading={loading}
        missingTextCount={missingTextCount}
        onOnlyMissingTextChange={setOnlyMissingText}
        onlyMissingText={onlyMissingText}
        onExpandedChange={(ids) => {
          if (!filtering) setExpanded(ids);
        }}
        onRetry={onRetry}
        onSearchChange={setSearch}
        onSelect={select}
        search={search}
        selectedId={selected?.id}
        tree={filtered.tree}
      />
      <Box ref={overviewRef} sx={{ minWidth: 0, scrollMarginTop: 88 }}>
        {selected ? (
          <CategoryOverviewCard
            ancestors={ancestorIds.flatMap((id) => byId.get(id) ?? [])}
            category={selected}
            childCategories={childCategories}
            content={contentQuery.data}
            contentError={contentQuery.isError}
            contentLoading={contentQuery.isLoading}
            detailsHref={`/categories/${selected.id}?category=${selected.id}`}
            onEdit={canEdit ? () => setEditOpen(true) : undefined}
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
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Box>
  );
}
