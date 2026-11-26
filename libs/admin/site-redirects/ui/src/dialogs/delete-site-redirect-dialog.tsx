import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import type { SiteRedirect } from '@admin/site-redirects/model';

interface DeleteSiteRedirectDialogProps {
  redirect: SiteRedirect | null;
  deleting: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Confirms removing a redirect; the old address then answers as the site would without it. */
export function DeleteSiteRedirectDialog({
  deleting,
  error,
  onCancel,
  onConfirm,
  redirect,
}: DeleteSiteRedirectDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={deleting ? undefined : onCancel}
      open={redirect !== null}
    >
      <DialogTitle>Видалити переадресацію?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>
          {redirect ? `${redirect.from} → ${redirect.to}. ` : ''}Стара адреса знову відкриватиме те,
          що є на сайті за нею (або сторінку «не знайдено»).
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
