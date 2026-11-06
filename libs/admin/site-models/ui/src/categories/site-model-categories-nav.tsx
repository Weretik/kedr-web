import { siteCategoryAncestors, siteCategoryTree } from '@admin/site-models/model';
import { Box, Button, Card, Skeleton, Stack, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useState } from 'react';

import type { SiteCategoryNode, SiteModelCategory } from '@admin/site-models/model';

interface SiteModelCategoriesNavProps {
  categories: readonly SiteModelCategory[];
  loading: boolean;
  selectedId: number | undefined;
  onSelect: (categoryId: number | undefined) => void;
  /** What the count next to a category means: models or on-site products. */
  count: 'models' | 'products';
}

function TreeNodes({
  count,
  nodes,
}: {
  count: SiteModelCategoriesNavProps['count'];
  nodes: readonly SiteCategoryNode[];
}) {
  return nodes.map(({ category, children }) => {
    const total =
      count === 'models'
        ? category.acceptedModels + category.proposedModels
        : category.onSiteProducts;
    const problems = category.problemCount + category.loneProducts;
    return (
      <TreeItem
        itemId={String(category.id)}
        key={category.id}
        label={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', minWidth: 0, py: 0.25 }}>
            <Typography component="span" sx={{ overflowWrap: 'anywhere' }} variant="body2">
              {category.name}
            </Typography>
            {problems > 0 ? (
              <Typography
                aria-label={`Проблем: ${problems}`}
                component="span"
                sx={{ color: 'error.main', fontWeight: 700 }}
                variant="caption"
              >
                {problems}
              </Typography>
            ) : null}
            <Typography
              aria-label={count === 'models' ? `${total} моделей` : `${total} товарів`}
              color="text.secondary"
              component="span"
              sx={{ fontVariantNumeric: 'tabular-nums', ml: 'auto !important', pl: 1 }}
              variant="caption"
            >
              {total}
            </Typography>
          </Stack>
        }
      >
        {children.length > 0 ? <TreeNodes count={count} nodes={children} /> : null}
      </TreeItem>
    );
  });
}

/**
 * Category tree of «Моделі» and «Вітрина сайту»: only categories shown on the site with on-site products; a click
 * selects a category with its subcategories, the arrow expands; a red count marks problems.
 */
export function SiteModelCategoriesNav({
  categories,
  count,
  loading,
  onSelect,
  selectedId,
}: SiteModelCategoriesNavProps) {
  const [expanded, setExpanded] = useState<string[] | null>(null);
  // Once the list arrives, the branch of the selected category opens.
  if (expanded === null && categories.length > 0) {
    setExpanded(siteCategoryAncestors(categories, selectedId).map(String));
  }

  return (
    <Card component="nav" aria-label="Категорії" sx={{ minWidth: 0 }} variant="outlined">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 1 }}>
        <Button
          aria-pressed={selectedId === undefined}
          fullWidth
          onClick={() => onSelect(undefined)}
          sx={{ justifyContent: 'flex-start' }}
          variant={selectedId === undefined ? 'contained' : 'text'}
        >
          Усі категорії
        </Button>
      </Box>
      <Box sx={{ maxHeight: { md: 'calc(100vh - 260px)' }, overflowY: 'auto', p: 1 }}>
        {loading ? (
          <Skeleton aria-label="Завантаження категорій" height={160} variant="rounded" />
        ) : categories.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 1 }} variant="body2">
            Категорій з товарами на сайті немає.
          </Typography>
        ) : (
          <SimpleTreeView
            aria-label="Категорії"
            expandedItems={expanded ?? []}
            expansionTrigger="iconContainer"
            onExpandedItemsChange={(_event, ids) => setExpanded(ids)}
            onSelectedItemsChange={(event, id) => {
              // The arrow only opens the branch; it does not pick the category.
              const target = event?.target;
              if (target instanceof Element && target.closest(`.${treeItemClasses.iconContainer}`))
                return;
              if (id) onSelect(Number(id));
            }}
            selectedItems={selectedId === undefined ? null : String(selectedId)}
          >
            <TreeNodes count={count} nodes={siteCategoryTree(categories)} />
          </SimpleTreeView>
        )}
      </Box>
    </Card>
  );
}
