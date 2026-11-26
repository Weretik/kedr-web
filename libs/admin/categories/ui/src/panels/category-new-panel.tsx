import { categoryNameError, categoryNameMaxLength } from '@admin/categories/model';
import { AdminEditPanel } from '@admin/shared/ui';
import { Alert, Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';

import { CategoryParentPicker } from '../components/category-parent-picker';

import type { CategoryParentOption, NewCategoryDraft } from '@admin/categories/model';

interface CategoryNewPanelProps {
  open: boolean;
  draft: NewCategoryDraft;
  options: readonly CategoryParentOption[];
  /** After the first «Створити» the empty names show their message. */
  showErrors: boolean;
  saving: boolean;
  error?: string;
  onChange: (draft: NewCategoryDraft) => void;
  onParentChange: (parentId: number | null) => void;
  onSubmit: () => void;
  onClose: () => void;
}

/** «Нова категорія»: names, where to put it, and whether the site shows it (spec 002 R-001). */
export function CategoryNewPanel(props: CategoryNewPanelProps) {
  const { draft } = props;
  const ukError = props.showErrors ? categoryNameError(draft.nameUk) : undefined;
  const ruError = props.showErrors ? categoryNameError(draft.nameRu) : undefined;

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={props.saving} onClick={props.onClose}>
            Скасувати
          </Button>
          <Button disabled={props.saving} type="submit" variant="contained">
            {props.saving ? 'Створення…' : 'Створити'}
          </Button>
        </>
      }
      busy={props.saving}
      onClose={props.onClose}
      onSubmit={(event) => {
        event.preventDefault();
        props.onSubmit();
      }}
      open={props.open}
      title="Нова категорія"
    >
      <Stack spacing={2}>
        <TextField
          autoComplete="off"
          error={Boolean(ukError)}
          helperText={ukError}
          label="Назва українською"
          onChange={(event) => props.onChange({ ...draft, nameUk: event.target.value })}
          required
          slotProps={{ htmlInput: { maxLength: categoryNameMaxLength } }}
          value={draft.nameUk}
        />
        <TextField
          autoComplete="off"
          error={Boolean(ruError)}
          helperText={ruError}
          label="Назва російською"
          onChange={(event) => props.onChange({ ...draft, nameRu: event.target.value })}
          required
          slotProps={{ htmlInput: { maxLength: categoryNameMaxLength } }}
          value={draft.nameRu}
        />
        <CategoryParentPicker
          disabled={props.saving}
          onChange={props.onParentChange}
          options={props.options}
          value={draft.parentId}
        />
        <FormControlLabel
          control={
            <Switch
              checked={draft.isShownOnSite}
              onChange={(event) =>
                props.onChange({ ...draft, isShownOnSite: event.target.checked })
              }
            />
          }
          label="Показувати на сайті"
        />
        {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      </Stack>
    </AdminEditPanel>
  );
}
