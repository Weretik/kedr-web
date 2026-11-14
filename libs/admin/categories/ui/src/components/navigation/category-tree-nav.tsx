import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
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
  Typography,
} from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';

import { CategoryTreeNodes } from './category-tree-nodes';

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
            <CategoryTreeNodes nodes={tree} />
          </SimpleTreeView>
        )}
      </Box>
    </Card>
  );
}
