import SearchIcon from '@mui/icons-material/Search';
import {
  Alert,
  Button,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import { CategoryFormDialog } from '../components/category-form-dialog';

import type { CategorySiteModel } from '@admin/categories/model';

interface CategoryAddModelsDialogProps {
  open: boolean;
  categoryName: string;
  search: string;
  /** Models found by the search, on the first page. */
  models: readonly CategorySiteModel[];
  /** Models already in this category: checked and locked. */
  presentIds: ReadonlySet<number>;
  selectedIds: ReadonlySet<number>;
  loading: boolean;
  saving: boolean;
  error?: string;
  onSearchChange: (search: string) => void;
  onToggle: (modelId: number) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/** «Додати моделі в категорію»: pick models by name; they move here with all their products (spec 002 R-006). */
export function CategoryAddModelsDialog(props: CategoryAddModelsDialogProps) {
  const count = props.selectedIds.size;
  return (
    <CategoryFormDialog
      actions={
        <>
          <Button disabled={props.saving} onClick={props.onClose}>
            Скасувати
          </Button>
          <Button disabled={props.saving || count === 0} type="submit" variant="contained">
            {props.saving ? 'Додавання…' : `Додати (${count})`}
          </Button>
        </>
      }
      busy={props.saving}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      open={props.open}
      subtitle={props.categoryName}
      title="Додати моделі в категорію"
    >
      <Stack spacing={2}>
        <TextField
          autoComplete="off"
          label="Пошук моделей"
          onChange={(event) => props.onSearchChange(event.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          value={props.search}
        />
        {props.error ? <Alert severity="error">{props.error}</Alert> : null}
        {props.loading ? (
          <Skeleton aria-label="Пошук моделей" height={160} variant="rounded" />
        ) : props.models.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Моделей не знайдено.
          </Typography>
        ) : (
          <List dense disablePadding>
            {props.models.map((model) => {
              const present = props.presentIds.has(model.id);
              return (
                <ListItem disablePadding key={model.id}>
                  <ListItemButton
                    disabled={present || props.saving}
                    onClick={() => props.onToggle(model.id)}
                  >
                    <ListItemIcon>
                      <Checkbox
                        checked={present || props.selectedIds.has(model.id)}
                        disableRipple
                        edge="start"
                        slotProps={{ input: { 'aria-label': model.name } }}
                        tabIndex={-1}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={model.name}
                      secondary={present ? 'Вже тут' : model.categoryName}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}
      </Stack>
    </CategoryFormDialog>
  );
}
