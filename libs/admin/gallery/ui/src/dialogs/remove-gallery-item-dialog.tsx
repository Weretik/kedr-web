import { galleryItemLabel } from '@admin/gallery/model';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

import type { GalleryItem } from '@admin/gallery/model';

interface RemoveGalleryItemDialogProps {
  item: GalleryItem | null;
  removing: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** A photo stays in the media library, so removing a card loses nothing but its texts. */
export function RemoveGalleryItemDialog({
  error,
  item,
  onCancel,
  onConfirm,
  removing,
}: RemoveGalleryItemDialogProps) {
  const name = item ? galleryItemLabel(item.texts) : null;
  return (
    <Dialog fullWidth maxWidth="xs" onClose={removing ? undefined : onCancel} open={item !== null}>
      <DialogTitle>Прибрати з галереї?</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        <DialogContentText>
          {name ? `«${name}» зникне з сайту.` : 'Картка зникне з сайту.'}{' '}
          {item?.kind === 'photo'
            ? 'Сам файл залишиться в медіатеці.'
            : 'Відео на YouTube не зміниться.'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button disabled={removing} onClick={onCancel}>
          Скасувати
        </Button>
        <Button color="error" disabled={removing} onClick={onConfirm} variant="contained">
          {removing ? 'Видалення…' : 'Прибрати'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
