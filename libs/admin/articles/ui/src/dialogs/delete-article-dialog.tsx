import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

interface DeleteArticleDialogProps {
  open: boolean;
  title: string;
  deleting: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Deleting cannot be undone, so the dialog names the article; to hide it, turn publishing off instead. */
export function DeleteArticleDialog({
  deleting,
  error,
  onCancel,
  onConfirm,
  open,
  title,
}: DeleteArticleDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={deleting ? undefined : onCancel} open={open}>
      <DialogTitle>Видалити статтю?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>
          «{title}» зникне з сайту й адмінки назавжди. Щоб лише сховати статтю, вимкніть «Показувати
          на сайті».
        </DialogContentText>
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
