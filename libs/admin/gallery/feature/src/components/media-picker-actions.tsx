import { galleryPhotosPerAdd } from '@admin/gallery/model';
import { Button, DialogActions, Stack, Typography } from '@mui/material';

interface MediaPickerActionsProps {
  selectedCount: number;
  adding: boolean;
  /** Files are uploading; adding waits for them. */
  busy: boolean;
  onCancel: () => void;
  onAdd: () => void;
}

/** What is selected, the per-add limit, and the add and cancel buttons. */
export function MediaPickerActions({
  adding,
  busy,
  onAdd,
  onCancel,
  selectedCount,
}: MediaPickerActionsProps) {
  const tooMany = selectedCount > galleryPhotosPerAdd;
  return (
    <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
      <Typography color={tooMany ? 'error' : 'text.secondary'} variant="body2">
        {tooMany
          ? `За раз можна додати до ${galleryPhotosPerAdd} фото.`
          : selectedCount > 0
            ? `Вибрано: ${selectedCount}. Додадуться в кінець у порядку вибору.`
            : 'Натисніть на фото, щоб вибрати.'}
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button disabled={adding} onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          disabled={adding || selectedCount === 0 || tooMany || busy}
          onClick={onAdd}
          variant="contained"
        >
          {adding ? 'Додавання…' : 'Додати в галерею'}
        </Button>
      </Stack>
    </DialogActions>
  );
}
