import { Alert, Button, Stack, Typography } from '@mui/material';

import { CategoryFormDialog } from '../components/category-form-dialog';
import { CategoryParentPicker } from '../components/category-parent-picker';

import type { CategoryParentOption } from '@admin/categories/model';

interface CategoryMoveDialogProps {
  open: boolean;
  categoryName: string;
  /** «Вкласти в» choices without the category and its subcategories. */
  options: readonly CategoryParentOption[];
  draft: number | null;
  dirty: boolean;
  busy: boolean;
  error?: string;
  onDraftChange: (parentId: number | null) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/** «Перемістити»: a new parent for the category and its subcategories (spec 003 R-011, spec 002 R-003). */
export function CategoryMoveDialog(props: CategoryMoveDialogProps) {
  return (
    <CategoryFormDialog
      actions={
        <>
          <Button disabled={props.busy} onClick={props.onClose}>
            Скасувати
          </Button>
          <Button disabled={props.busy || !props.dirty} type="submit" variant="contained">
            {props.busy ? 'Переміщення…' : 'Перемістити'}
          </Button>
        </>
      }
      busy={props.busy}
      onClose={props.onClose}
      onSubmit={props.onSubmit}
      open={props.open}
      subtitle={props.categoryName}
      title="Перемістити категорію"
    >
      <Stack spacing={2}>
        <Typography color="text.secondary" variant="body2">
          Куди вкласти категорію разом з її підкатегоріями. Зміни тут важливіші за 1С.
        </Typography>
        <CategoryParentPicker
          disabled={props.busy}
          onChange={props.onDraftChange}
          options={props.options}
          value={props.draft}
        />
        {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      </Stack>
    </CategoryFormDialog>
  );
}
