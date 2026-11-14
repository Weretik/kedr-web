import { missingContentLanguages } from '@admin/categories/model';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { contentProblemLabel } from './content-problem-label';

import type { CategoryTreeNode } from '@admin/categories/model';

/** Tree items of the categories, nested by parent. */
export function CategoryTreeNodes({ nodes }: { nodes: readonly CategoryTreeNode[] }) {
  return nodes.map(({ category, children }) => {
    const problem = contentProblemLabel(missingContentLanguages(category));
    return (
      <TreeItem
        itemId={String(category.id)}
        key={category.id}
        label={
          <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', minWidth: 0, py: 0.25 }}>
            <Typography
              color={category.isShownOnSite ? 'text.primary' : 'text.secondary'}
              component="span"
              sx={{ fontWeight: category.level === 0 ? 700 : 500, overflowWrap: 'anywhere' }}
              variant="body2"
            >
              {category.nameUk}
            </Typography>
            {category.isShownOnSite ? null : (
              <Tooltip title="Не показується на сайті">
                <VisibilityOffOutlinedIcon
                  aria-label="Не показується на сайті"
                  role="img"
                  sx={{ alignSelf: 'center', color: 'text.secondary', fontSize: 16 }}
                />
              </Tooltip>
            )}
            {problem ? (
              <Tooltip title={problem}>
                <Box
                  aria-label={problem}
                  component="span"
                  role="img"
                  sx={{
                    alignSelf: 'center',
                    bgcolor: 'error.main',
                    borderRadius: '50%',
                    flex: 'none',
                    height: 8,
                    width: 8,
                  }}
                />
              </Tooltip>
            ) : null}
            {category.productCount !== null ? (
              <Typography
                aria-label={`${category.productCount} товарів`}
                color="text.secondary"
                component="span"
                sx={{ fontVariantNumeric: 'tabular-nums', ml: 'auto !important', pl: 1 }}
                variant="caption"
              >
                {category.productCount}
              </Typography>
            ) : null}
          </Stack>
        }
      >
        {children.length > 0 ? <CategoryTreeNodes nodes={children} /> : null}
      </TreeItem>
    );
  });
}

/** Left side of «Категорії»: search and the 1C tree; a click selects, the arrow expands. */
