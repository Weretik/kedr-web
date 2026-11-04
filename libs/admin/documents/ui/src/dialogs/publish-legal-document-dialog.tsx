import { validateEffectiveFrom } from '@admin/documents/model';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface PublishLegalDocumentDialogProps {
  open: boolean;
  title: string;
  /** Legal texts ask for «Редакція від»; delivery & payment publishes with today's date silently. */
  asksEditionDate: boolean;
  today: string;
  /** The date of the edition on the site; the new one may not be earlier. Remount (key) to reset. */
  publishedFrom: string | null;
  publishing: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (effectiveFrom: string) => void;
}

export function PublishLegalDocumentDialog({
  asksEditionDate,
  error,
  onCancel,
  onConfirm,
  open,
  publishedFrom,
  publishing,
  title,
  today,
}: PublishLegalDocumentDialogProps) {
  const initial = publishedFrom && publishedFrom > today ? publishedFrom : today;
  const [date, setDate] = useState(initial);
  const [dateError, setDateError] = useState<string | undefined>();

  const confirm = () => {
    const problem = validateEffectiveFrom(date, publishedFrom);
    setDateError(problem);
    if (!problem) onConfirm(date);
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={publishing ? undefined : onCancel} open={open}>
      <DialogTitle>Опублікувати на сайті?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText sx={{ mb: asksEditionDate ? 2 : 0 }}>
          «{title}» з’явиться на сайті протягом 10 хвилин. Попередня редакція збережеться в історії.
        </DialogContentText>
        {asksEditionDate ? (
          <TextField
            error={Boolean(dateError)}
            fullWidth
            helperText={dateError ?? 'Показується на сайті як «Редакція від».'}
            label="Редакція від"
            onChange={(event) => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={date}
          />
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button disabled={publishing} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={publishing} onClick={confirm} variant="contained">
          {publishing ? 'Публікація…' : 'Опублікувати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
