import { StatusPill } from '@admin/shared/ui';
import { Card, Skeleton, Stack, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { useState } from 'react';

import type { FilterCategoryNode } from '@admin/catalog-attributes/model';

interface FilterCategoriesTreeProps {
  nodes: readonly FilterCategoryNode[];
  loading: boolean;
  selectedId: number | undefined;
  /** Only a final category (without subcategories) can be selected: filters live there. */
  onSelect: (node: FilterCategoryNode) => void;
}

function filterCountText(count: number): string {
  const last = count % 10;
  const teen = count % 100 >= 11 && count % 100 <= 14;
  if (last === 1 && !teen) return `${count} фільтр`;
  if (last >= 2 && last <= 4 && !teen) return `${count} фільтри`;
  return `${count} фільтрів`;
}

function Nodes({ nodes }: { nodes: readonly FilterCategoryNode[] }) {
  return nodes.map((node) => {
    const final = node.children.length === 0;
    return (
      <TreeItem
        itemId={String(node.category.id)}
        key={node.category.id}
        label={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0, py: 0.25 }}>
            <Typography
              component="span"
              sx={{ flex: 1, fontWeight: final ? 400 : 600, overflowWrap: 'anywhere' }}
              variant="body2"
            >
              {node.category.name}
            </Typography>
            {final && node.category.filterCount === 0 ? (
              <StatusPill label="без фільтрів" tone="warning" />
            ) : null}
            {final && node.category.filterCount > 0 ? (
              <Typography color="text.secondary" component="span" variant="caption">
                {filterCountText(node.category.filterCount)}
              </Typography>
            ) : null}
          </Stack>
        }
      >
        {final ? null : <Nodes nodes={node.children} />}
      </TreeItem>
    );
  });
}

function allIds(nodes: readonly FilterCategoryNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children.length > 0 ? [String(node.category.id), ...allIds(node.children)] : [],
  );
}

/** Categories shown on the site, as a tree; a final category without filters is marked. */
export function FilterCategoriesTree({
  loading,
  nodes,
  onSelect,
  selectedId,
}: FilterCategoriesTreeProps) {
  const [expanded, setExpanded] = useState<string[] | null>(null);
  // Once the tree arrives, every branch is open: the list is short and a person scans it.
  if (expanded === null && nodes.length > 0) setExpanded(allIds(nodes));

  const byId = new Map<string, FilterCategoryNode>();
  const index = (items: readonly FilterCategoryNode[]) =>
    items.forEach((node) => {
      byId.set(String(node.category.id), node);
      index(node.children);
    });
  index(nodes);

  return (
    <Card
      component="nav"
      aria-label="Категорії сайту"
      sx={{ minWidth: 0, p: 1 }}
      variant="outlined"
    >
      <Typography color="text.secondary" sx={{ display: 'block', p: 1 }} variant="caption">
        Лише категорії, що показуються на сайті. Фільтри працюють у кінцевих категоріях.
      </Typography>
      {loading ? (
        <Skeleton aria-label="Завантаження категорій" height={200} variant="rounded" />
      ) : nodes.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 1 }} variant="body2">
          На сайті немає категорій з товарами.
        </Typography>
      ) : (
        <SimpleTreeView
          aria-label="Категорії сайту"
          expandedItems={expanded ?? []}
          onExpandedItemsChange={(_event, ids) => setExpanded(ids)}
          onSelectedItemsChange={(_event, id) => {
            const node = id ? byId.get(id) : undefined;
            if (node && node.children.length === 0) onSelect(node);
          }}
          selectedItems={selectedId === undefined ? null : String(selectedId)}
          sx={{ maxHeight: { md: 'calc(100vh - 300px)' }, overflowY: 'auto' }}
        >
          <Nodes nodes={nodes} />
        </SimpleTreeView>
      )}
    </Card>
  );
}
