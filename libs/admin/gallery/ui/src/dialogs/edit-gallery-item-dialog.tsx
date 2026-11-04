import { galleryItemLabel, galleryTextsIssues, youtubeWatchUrl } from '@admin/gallery/model';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Stack,
} from '@mui/material';
import { useState } from 'react';

import { GalleryTextsFields } from '../forms/gallery-texts-fields';

import type { GalleryItem, GalleryTexts } from '@admin/gallery/model';

interface EditGalleryItemDialogProps {
  item: GalleryItem;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (texts: GalleryTexts) => void;
}

/** Title and caption of one card. Mount it per card (key) so it starts from that card's texts. */
export function EditGalleryItemDialog({
  error,
  item,
  onCancel,
  onSave,
  saving,
}: EditGalleryItemDialogProps) {
  const [texts, setTexts] = useState(item.texts);
  const issues = galleryTextsIssues(texts);
  const valid = Object.keys(issues).length === 0;

  return (
    <Dialog fullWidth maxWidth="md" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>
        {galleryItemLabel(item.texts) ?? (item.kind === 'video' ? 'Відео' : 'Фото')}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ alignItems: 'center' }}>
            {item.previewUrl ? (
              <Box
                alt=""
                component="img"
                src={item.previewUrl}
                sx={{ borderRadius: 1, maxHeight: 140, maxWidth: 240, objectFit: 'cover' }}
              />
            ) : null}
            {item.kind === 'video' && item.youtubeId ? (
              <Link href={youtubeWatchUrl(item.youtubeId)} rel="noreferrer" target="_blank">
                Відкрити на YouTube <OpenInNewIcon fontSize="inherit" />
              </Link>
            ) : item.fileName ? (
              <Box sx={{ color: 'text.secondary', typography: 'body2' }}>Файл: {item.fileName}</Box>
            ) : null}
          </Stack>
          <GalleryTextsFields issues={issues} onChange={setTexts} texts={texts} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={saving || !valid} onClick={() => onSave(texts)} variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
