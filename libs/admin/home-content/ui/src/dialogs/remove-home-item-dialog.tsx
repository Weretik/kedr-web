import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface RemoveHomeItemDialogProps {
  open: boolean;
  title: string;
  text: string;
  removing: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirms removing a question or a brand from the home page. */
export function RemoveHomeItemDialog({
  error,
  onCancel,
  onConfirm,
  open,
  removing,
  text,
  title,
}: RemoveHomeItemDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={removing ? undefined : onCancel} open={open}>
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
        <Button disabled={removing} onClick={onCancel}>
          Скасувати
        </Button>
        <Button color="error" disabled={removing} onClick={onConfirm} variant="contained">
          {removing ? 'Видалення…' : 'Видалити'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
