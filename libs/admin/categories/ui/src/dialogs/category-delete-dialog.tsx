import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface CategoryDeleteDialogProps {
  name: string;
  deleting: boolean;
  error: string | null;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirms deleting a manual category; the server refuses while it has models or subcategories (spec 002 R-004). */
export function CategoryDeleteDialog({
  deleting,
  error,
  name,
  onCancel,
  onConfirm,
}: CategoryDeleteDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={deleting ? undefined : onCancel} open>
      <DialogTitle>Видалити категорію «{name}»?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>Категорія зникне з сайту і перейде у «Видалені».</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={deleting} onClick={onCancel}>
          Скасувати
        </Button>
        <Button color="error" disabled={deleting} onClick={onConfirm} variant="contained">
          Видалити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
