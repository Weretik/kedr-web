import { uploadFolderId } from '@admin/media/model';
import { MediaDropZone, MediaFileGrid } from '@admin/media/ui';
import { PageIssues } from '@admin/shared/ui';
import { Dialog, DialogContent, DialogTitle, Pagination, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { MediaPickerActions } from './media-picker-actions';
import { MediaPickerToolbar } from './media-picker-toolbar';
import { useMediaBrowse } from '../hooks/use-media-browse';
import { usePhotoUploads } from '../hooks/use-photo-uploads';

interface MediaPickerDialogProps {
  open: boolean;
  /** Files already in the gallery are marked so they are not picked twice. */
  inGallery: ReadonlySet<number>;
  adding: boolean;
  error?: string;
  onCancel: () => void;
  onAdd: (ids: number[]) => void;
}

/**
 * Picks pictures from the media library, or uploads new ones from the computer straight into the chosen folder
 * (they come back selected). The gallery stores only the file IDs.
 */
export function MediaPickerDialog({
  adding,
  error,
  inGallery,
  onAdd,
  onCancel,
  open,
}: MediaPickerDialogProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const uploads = usePhotoUploads();
  const { changeScope, files, options, page, scope, search, searching, setPage, setSearch } =
    useMediaBrowse(open);

  const uploadFolder = uploadFolderId(scope);
  const uploadTarget =
    scope.kind === 'folder'
      ? `у папку «${options.find((option) => option.id === scope.folderId)?.label ?? ''}»`
      : 'у корінь медіатеки';

  const pageData = files.data;
  const pageCount = pageData ? Math.ceil(pageData.totalCount / pageData.pageSize) : 0;
  const visible = (pageData?.items ?? []).filter((file) => !inGallery.has(file.id));
  const hiddenCount = (pageData?.items.length ?? 0) - visible.length;
  const selectedSet = new Set(selected);

  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const startUpload = async (picked: readonly File[]) => {
    const ids = await uploads.upload(picked, uploadFolder);
    if (ids.length > 0)
      setSelected((current) => [...current, ...ids.filter((id) => !current.includes(id))]);
  };
  const close = () => {
    setSelected([]);
    uploads.clearIssues();
    onCancel();
  };

  return (
    <Dialog fullWidth maxWidth="lg" onClose={adding ? undefined : close} open={open}>
      <DialogTitle>Фото з медіатеки</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <PageIssues
            messages={error ? [error, ...uploads.issues] : uploads.issues}
            revealKey={uploads.issues.join('|')}
            title="Не все вдалося"
          />
          <MediaPickerToolbar
            folderOptions={options}
            onFiles={(picked) => void startUpload(picked)}
            onScopeChange={changeScope}
            onSearchChange={setSearch}
            progress={uploads.progress}
            scope={scope}
            search={search}
          />
          <MediaDropZone
            disabled={uploads.progress !== null}
            onFiles={(dropped) => void startUpload(dropped)}
            targetLabel={uploadTarget}
          >
            <Stack spacing={1}>
              {hiddenCount > 0 ? (
                <Typography color="text.secondary" variant="caption">
                  Фото, які вже є в галереї, тут не показано ({hiddenCount}).
                </Typography>
              ) : null}
              <MediaFileGrid
                emptyText={
                  searching
                    ? 'Нічого не знайдено. Змініть пошук.'
                    : 'Тут немає нових фото. Завантажте їх або перетягніть сюди.'
                }
                error={files.isError}
                files={visible}
                loading={files.isFetching}
                onOpen={(file) => toggle(file.id)}
                onRetry={() => files.refetch()}
                onToggle={(file) => toggle(file.id)}
                selectedIds={selectedSet}
              />
              {pageCount > 1 ? (
                <Pagination
                  count={pageCount}
                  onChange={(_event, value) => setPage(value)}
                  page={page}
                  sx={{ alignSelf: 'center' }}
                />
              ) : null}
            </Stack>
          </MediaDropZone>
        </Stack>
      </DialogContent>
      <MediaPickerActions
        adding={adding}
        busy={uploads.progress !== null}
        onAdd={() => onAdd(selected)}
        onCancel={close}
        selectedCount={selected.length}
      />
    </Dialog>
  );
}
