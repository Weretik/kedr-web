import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import type { ProductGroupOption } from '@admin/products/model';

interface MoveToGroupDialogProps {
  options: readonly ProductGroupOption[];
  loading: boolean;
  saving: boolean;
  error: string | null;
  onSearchChange: (search: string) => void;
  onCancel: () => void;
  onMove: (groupId: number) => void;
}

/** «Перенести в іншу групу»: groups of the product's category found by name. */
export function MoveToGroupDialog({
  error,
  loading,
  onCancel,
  onMove,
  onSearchChange,
  options,
  saving,
}: MoveToGroupDialogProps) {
  const [chosen, setChosen] = useState<ProductGroupOption | null>(null);

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>Перенести в іншу групу</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Autocomplete
            filterOptions={(items) => items}
            getOptionLabel={(option) => `${option.name} (${option.productCount})`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            loading={loading}
            noOptionsText="Груп не знайдено"
            onChange={(_event, option) => setChosen(option)}
            onInputChange={(_event, value, reason) => {
              if (reason === 'input') onSearchChange(value);
            }}
            options={options}
            renderInput={(params) => <TextField {...params} label="Група цієї категорії" />}
            value={chosen}
          />
          <Alert severity="info">
            Товар залишиться в цій групі, доки його не перенесуть знову.
          </Alert>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          disabled={!chosen || saving}
          onClick={() => chosen && onMove(chosen.id)}
          variant="contained"
        >
          Перенести
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface NewGroupDialogProps {
  initialName: string;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onCreate: (name: string) => void;
}

/** «Нова група» from this product. */
export function NewGroupDialog({
  error,
  initialName,
  onCancel,
  onCreate,
  saving,
}: NewGroupDialogProps) {
  const [name, setName] = useState(initialName);
  const trimmed = name.trim();

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>Нова група</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            label="Назва групи"
            onChange={(event) => setName(event.target.value)}
            slotProps={{ htmlInput: { maxLength: 300 } }}
            value={name}
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={!trimmed || saving} onClick={() => onCreate(trimmed)} variant="contained">
          Створити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
