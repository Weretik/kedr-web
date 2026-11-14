import { missingContentLanguages } from '@admin/categories/model';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

import { contentProblemLabel } from './content-problem-label';

import type { CategoryTreeNode } from '@admin/categories/model';

interface CategoryTreeNavProps {
  tree: readonly CategoryTreeNode[];
  selectedId: number | undefined;
  /** Item IDs as strings, the tree view's own format. */
  expandedIds: readonly string[];
  search: string;
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onSearchChange: (value: string) => void;
  onExpandedChange: (ids: string[]) => void;
  onSelect: (categoryId: number) => void;
  /** Categories with a missing language; the filter chip shows only when it is above zero. */
  missingTextCount: number;
  onlyMissingText: boolean;
  onOnlyMissingTextChange: (value: boolean) => void;
}

function TreeNodes({ nodes }: { nodes: readonly CategoryTreeNode[] }) {
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
        {children.length > 0 ? <TreeNodes nodes={children} /> : null}
      </TreeItem>
    );
  });
}

/** Left side of «Категорії»: search and the 1C tree; a click selects, the arrow expands. */
export function CategoryTreeNav({
  error,
  expandedIds,
  loading,
  onExpandedChange,
  onRetry,
  onSearchChange,
  onSelect,
  search,
  selectedId,
  tree,
  missingTextCount,
  onlyMissingText,
  onOnlyMissingTextChange,
}: CategoryTreeNavProps) {
  return (
    <Card component="nav" aria-label="Дерево категорій" sx={{ minWidth: 0 }} variant="outlined">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', p: 2 }}>
        <TextField
          fullWidth
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Пошук за назвою або адресою"
          size="small"
          slotProps={{
            htmlInput: { 'aria-label': 'Пошук категорій' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon aria-hidden="true" fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          value={search}
        />
        {missingTextCount > 0 || onlyMissingText ? (
          <Chip
            aria-pressed={onlyMissingText}
            color={onlyMissingText ? 'error' : 'default'}
            label={`Без тексту · ${missingTextCount}`}
            onClick={() => onOnlyMissingTextChange(!onlyMissingText)}
            size="small"
            sx={{ mt: 1.5 }}
            variant={onlyMissingText ? 'filled' : 'outlined'}
          />
        ) : null}
      </Box>
      <Box sx={{ maxHeight: { md: 'calc(100vh - 260px)' }, overflowY: 'auto', p: 1 }}>
        {loading ? (
          <Stack spacing={1} sx={{ p: 1 }}>
            {[0, 1, 2, 3, 4].map((index) => (
              <Skeleton height={28} key={index} variant="rounded" />
            ))}
          </Stack>
        ) : error ? (
          <Alert action={<Button onClick={onRetry}>Повторити</Button>} severity="error">
            Не вдалося завантажити категорії.
          </Alert>
        ) : tree.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 2 }} variant="body2">
            {search.trim() || onlyMissingText ? 'Нічого не знайдено.' : 'Категорій немає.'}
          </Typography>
        ) : (
          <SimpleTreeView
            aria-label="Категорії"
            expandedItems={expandedIds}
            expansionTrigger="iconContainer"
            onExpandedItemsChange={(_event, ids) => onExpandedChange(ids)}
            onSelectedItemsChange={(_event, id) => {
              if (id) onSelect(Number(id));
            }}
            selectedItems={selectedId === undefined ? null : String(selectedId)}
          >
            <TreeNodes nodes={tree} />
          </SimpleTreeView>
        )}
      </Box>
    </Card>
  );
}
