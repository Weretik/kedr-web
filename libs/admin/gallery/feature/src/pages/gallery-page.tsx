import { useGetGalleryQuery } from '@admin/gallery/data-access';
import {
  AddVideoPanel,
  EditGalleryItemPanel,
  GalleryGrid,
  RemoveGalleryItemDialog,
} from '@admin/gallery/ui';
import { AdminPageHeader, NoticeSnackbar } from '@admin/shared/ui';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useMemo, useState } from 'react';

import { MediaPickerDialog } from '../components/media-picker/media-picker-dialog';
import { useGalleryActions } from '../hooks/use-gallery-actions';
import { useYoutubeLink } from '../hooks/use-youtube-link';

import type { GalleryItem } from '@admin/gallery/model';

type Dialog =
  | { kind: 'none' }
  | { kind: 'photos' }
  | { kind: 'video' }
  | { kind: 'edit'; item: GalleryItem }
  | { kind: 'remove'; item: GalleryItem };

/** The site gallery: photos from the media library and YouTube videos, in the order the site shows them. */
export function GalleryPage() {
  const query = useGetGalleryQuery();
  const [notice, setNotice] = useState<string | null>(null);
  const [dialog, setDialog] = useState<Dialog>({ kind: 'none' });
  const [error, setError] = useState<string | undefined>();
  const actions = useGalleryActions(setNotice);
  const youtube = useYoutubeLink();
  const items = useMemo(() => query.data ?? [], [query.data]);
  const inGallery = useMemo(
    () => new Set(items.flatMap((item) => (item.mediaFileId === null ? [] : [item.mediaFileId]))),
    [items],
  );

  const open = (next: Dialog) => {
    setError(undefined);
    setDialog(next);
  };
  const close = () => {
    setError(undefined);
    setDialog({ kind: 'none' });
    youtube.reset();
  };
  const finish = (failure: string | undefined) => (failure ? setError(failure) : close());

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <>
            <Button
              onClick={() => open({ kind: 'photos' })}
              startIcon={<AddPhotoAlternateOutlinedIcon />}
              variant="contained"
            >
              Додати фото
            </Button>
            <Button
              onClick={() => open({ kind: 'video' })}
              startIcon={<SmartDisplayOutlinedIcon />}
              variant="outlined"
            >
              Додати відео
            </Button>
          </>
        }
        title="Галерея"
      />
      <Typography color="text.secondary" variant="body2">
        Фото з медіатеки та відео з YouTube на сторінці «Галерея» сайту. Перетягніть картку або
        скористайтеся стрілками, щоб змінити порядок; зміни з’являються на сайті за кілька хвилин.
      </Typography>
      {actions.orderError ? (
        <Alert onClose={actions.clearOrderError} severity="error">
          {actions.orderError}
        </Alert>
      ) : null}
      {query.isError ? (
        <Alert action={<Button onClick={() => query.refetch()}>Повторити</Button>} severity="error">
          Не вдалося завантажити галерею. Спробуйте ще раз.
        </Alert>
      ) : (
        <GalleryGrid
          items={items}
          loading={query.isLoading}
          onAddPhotos={() => open({ kind: 'photos' })}
          onAddVideo={() => open({ kind: 'video' })}
          onEdit={(item) => open({ kind: 'edit', item })}
          onMove={(item, to) => void actions.move(items, item, to)}
          onRemove={(item) => open({ kind: 'remove', item })}
          reordering={actions.reordering}
        />
      )}

      {dialog.kind === 'photos' ? (
        <MediaPickerDialog
          adding={actions.adding}
          error={error}
          inGallery={inGallery}
          onAdd={(ids) => void actions.addPhotos(ids, items.length).then(finish)}
          onCancel={close}
          open
        />
      ) : null}
      <AddVideoPanel
        error={dialog.kind === 'video' ? error : undefined}
        link={youtube.link}
        linkState={youtube.state}
        onAdd={() => void actions.addVideo(youtube.link, youtube.texts).then(finish)}
        onCancel={close}
        onLinkChange={youtube.setLink}
        onTextsChange={youtube.setTexts}
        open={dialog.kind === 'video'}
        saving={actions.adding}
        texts={youtube.texts}
      />
      {dialog.kind === 'edit' ? (
        <EditGalleryItemPanel
          error={error}
          item={dialog.item}
          key={dialog.item.id}
          onCancel={close}
          onSave={(texts) => void actions.save(dialog.item, texts).then(finish)}
          saving={actions.saving}
        />
      ) : null}
      <RemoveGalleryItemDialog
        error={dialog.kind === 'remove' ? error : undefined}
        item={dialog.kind === 'remove' ? dialog.item : null}
        onCancel={close}
        onConfirm={() => {
          if (dialog.kind === 'remove') void actions.remove(dialog.item).then(finish);
        }}
        removing={actions.removing}
      />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default GalleryPage;
