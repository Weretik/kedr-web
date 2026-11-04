import { galleryTextsIssues } from '@admin/gallery/model';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';

import { GalleryTextsFields } from '../forms/gallery-texts-fields';

import type { GalleryTexts, YoutubePreview } from '@admin/gallery/model';

/** What the pasted link is: nothing yet, not YouTube, being checked, found, or YouTube did not answer. */
export type YoutubeLinkState =
  | { status: 'empty' }
  | { status: 'invalid' }
  | { status: 'checking' }
  | { status: 'ready'; preview: YoutubePreview }
  | { status: 'failed' };

interface AddVideoDialogProps {
  open: boolean;
  link: string;
  linkState: YoutubeLinkState;
  texts: GalleryTexts;
  saving: boolean;
  error?: string;
  onLinkChange: (link: string) => void;
  onTextsChange: (texts: GalleryTexts) => void;
  onCancel: () => void;
  onAdd: () => void;
}

const linkHelp = (state: YoutubeLinkState) => {
  if (state.status === 'invalid') return 'Це не посилання на відео YouTube.';
  if (state.status === 'failed') return 'YouTube не відповів: назву введіть вручну.';
  if (state.status === 'ready' && state.preview.alreadyInGallery)
    return 'Це відео вже є в галереї.';
  return 'Наприклад, https://youtu.be/… або https://www.youtube.com/watch?v=…';
};

/** Paste a link: the poster and YouTube's title appear, the title can be changed before adding. */
export function AddVideoDialog({
  error,
  link,
  linkState,
  onAdd,
  onCancel,
  onLinkChange,
  onTextsChange,
  open,
  saving,
  texts,
}: AddVideoDialogProps) {
  const issues = galleryTextsIssues(texts);
  const found = linkState.status === 'ready' || linkState.status === 'failed';
  const duplicate = linkState.status === 'ready' && linkState.preview.alreadyInGallery;
  const canAdd = found && !duplicate && Object.keys(issues).length === 0 && !saving;

  return (
    <Dialog fullWidth maxWidth="md" onClose={saving ? undefined : onCancel} open={open}>
      <DialogTitle>Додати відео з YouTube</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            error={linkState.status === 'invalid' || duplicate}
            fullWidth
            helperText={linkHelp(linkState)}
            label="Посилання на відео"
            onChange={(event) => onLinkChange(event.target.value)}
            slotProps={{
              input: {
                endAdornment:
                  linkState.status === 'checking' ? <CircularProgress size={20} /> : null,
              },
            }}
            value={link}
          />
          {linkState.status === 'ready' ? (
            <Box
              alt=""
              component="img"
              src={linkState.preview.thumbnailUrl}
              sx={{ alignSelf: 'flex-start', borderRadius: 1, maxHeight: 180, objectFit: 'cover' }}
            />
          ) : null}
          {found ? (
            <>
              <DialogContentText variant="body2">
                Назву взято з YouTube. Її можна змінити або перекласти; підпис необов’язковий.
              </DialogContentText>
              <GalleryTextsFields issues={issues} onChange={onTextsChange} texts={texts} />
            </>
          ) : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={!canAdd} onClick={onAdd} variant="contained">
          {saving ? 'Додавання…' : 'Додати в кінець'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
