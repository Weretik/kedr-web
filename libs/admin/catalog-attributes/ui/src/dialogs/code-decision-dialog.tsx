import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { CatalogAttributeValue, UnresolvedCode } from '@admin/catalog-attributes/model';

/** «Без значення» in the select: the code means nothing to filter by. */
const noValue = 'none';

interface CodeDecisionDialogProps {
  code: UnresolvedCode;
  /** Values of the code's attribute. */
  values: readonly CatalogAttributeValue[];
  valuesLoading: boolean;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSave: (valueId: number | null) => void;
}

/** The owner decodes a 1C code: picks the value it means, or says it means none. */
export function CodeDecisionDialog({
  code,
  error,
  onCancel,
  onSave,
  saving,
  values,
  valuesLoading,
}: CodeDecisionDialogProps) {
  const [choice, setChoice] = useState(code.valueId === null ? '' : String(code.valueId));

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>Код «{code.rawValue}»</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Typography color="text.secondary" variant="body2">
            {code.attributeName} · товарів: {code.productCount}
            {code.note ? ` · ${code.note}` : ''}
          </Typography>
          <TextField
            disabled={valuesLoading}
            label="Що означає код"
            onChange={(event) => setChoice(event.target.value)}
            select
            value={choice}
          >
            <MenuItem value={noValue}>Без значення: не використовувати у фільтрах</MenuItem>
            {values.map((value) => (
              <MenuItem key={value.id} value={String(value.id)}>
                {value.nameUk} ({value.code})
              </MenuItem>
            ))}
          </TextField>
          <Alert severity="info">
            Рішення збережеться у словнику. Товари з цим кодом отримають значення під час наступного
            розпізнавання.
          </Alert>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          disabled={saving || choice === ''}
          onClick={() => onSave(choice === noValue ? null : Number(choice))}
          variant="contained"
        >
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
