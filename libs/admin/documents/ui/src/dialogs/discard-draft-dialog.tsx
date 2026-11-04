import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DiscardDraftDialogProps {
  open: boolean;
  deleting: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Drops the unpublished changes; the edition on the site stays as it is. */
export function DiscardDraftDialog({
  deleting,
  error,
  onCancel,
  onConfirm,
  open,
}: DiscardDraftDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={deleting ? undefined : onCancel} open={open}>
      <DialogTitle>Видалити чернетку?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>
          Неопубліковані зміни зникнуть. Текст на сайті залишиться без змін.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onCancel}>
          Скасувати
        </Button>
        <Button color="error" disabled={deleting} onClick={onConfirm} variant="contained">
          {deleting ? 'Видалення…' : 'Видалити чернетку'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
