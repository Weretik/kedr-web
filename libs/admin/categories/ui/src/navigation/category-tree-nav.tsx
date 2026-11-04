import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Alert,
  Box,
  Button,
  Card,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

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
}

function TreeNodes({ nodes }: { nodes: readonly CategoryTreeNode[] }) {
  return nodes.map(({ category, children }) => (
    <TreeItem
      itemId={String(category.id)}
      key={category.id}
      label={
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', minWidth: 0, py: 0.25 }}>
          <Typography
            component="span"
            sx={{ fontWeight: category.level === 0 ? 700 : 500, overflowWrap: 'anywhere' }}
            variant="body2"
          >
            {category.nameUk}
          </Typography>
          {children.length > 0 ? (
            <Typography
              aria-label={`${children.length} підкатегорій`}
              color="text.secondary"
              component="span"
              sx={{ fontVariantNumeric: 'tabular-nums', ml: 'auto' }}
              variant="caption"
            >
              {children.length}
            </Typography>
          ) : null}
        </Stack>
      }
    >
      {children.length > 0 ? <TreeNodes nodes={children} /> : null}
    </TreeItem>
  ));
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
            {search.trim() ? 'Нічого не знайдено.' : 'Категорій немає.'}
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
