import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface ConfirmMediaDeleteDialogProps {
  open: boolean;
  title: string;
  /** What disappears, in the words of the page. */
  text: string;
  deleting: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Deleting a file removes it from the CDN for good, so it always asks first. */
export function ConfirmMediaDeleteDialog({
  deleting,
  error,
  onCancel,
  onConfirm,
  open,
  text,
  title,
}: ConfirmMediaDeleteDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={deleting ? undefined : onCancel} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>{text}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onCancel}>
          Скасувати
        </Button>
        <Button color="error" disabled={deleting} onClick={onConfirm} variant="contained">
          {deleting ? 'Видалення…' : 'Видалити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
