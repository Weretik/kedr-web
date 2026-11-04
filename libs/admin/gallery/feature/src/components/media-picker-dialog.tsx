import { galleryPhotosPerAdd } from '@admin/gallery/model';
import { mediaAcceptedTypes } from '@admin/media/model';
import { MediaDropZone, MediaFileGrid } from '@admin/media/ui';
import { PageIssues } from '@admin/shared/ui';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { useMediaBrowse } from '../hooks/use-media-browse';
import { usePhotoUploads } from '../hooks/use-photo-uploads';

import type { ChangeEvent } from 'react';

interface MediaPickerDialogProps {
  open: boolean;
  /** Files already in the gallery are marked so they are not picked twice. */
  inGallery: ReadonlySet<number>;
  adding: boolean;
  error?: string;
  onCancel: () => void;
  onAdd: (ids: number[]) => void;
}

const allValue = 'all';
const rootValue = 'root';

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

  const scopeValue =
    scope.kind === 'folder' ? String(scope.folderId) : scope.kind === 'root' ? rootValue : allValue;
  const uploadFolder = scope.kind === 'folder' ? scope.folderId : null;
  const uploadTarget =
    scope.kind === 'folder'
      ? `у папку «${options.find((option) => option.id === scope.folderId)?.label ?? ''}»`
      : 'у корінь медіатеки';

  const pageData = files.data;
  const pageCount = pageData ? Math.ceil(pageData.totalCount / pageData.pageSize) : 0;
  const visible = (pageData?.items ?? []).filter((file) => !inGallery.has(file.id));
  const hiddenCount = (pageData?.items.length ?? 0) - visible.length;
  const selectedSet = new Set(selected);
  const tooMany = selected.length > galleryPhotosPerAdd;

  const toggle = (id: number) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const startUpload = async (picked: readonly File[]) => {
    const ids = await uploads.upload(picked, uploadFolder);
    if (ids.length > 0)
      setSelected((current) => [...current, ...ids.filter((id) => !current.includes(id))]);
  };
  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (picked.length > 0) void startUpload(picked);
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
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              label="Папка"
              onChange={(event) => {
                const value = event.target.value;
                changeScope(
                  value === allValue
                    ? { kind: 'all' }
                    : value === rootValue
                      ? { kind: 'root' }
                      : { kind: 'folder', folderId: Number(value) },
                );
              }}
              select
              sx={{ minWidth: 260 }}
              value={scopeValue}
            >
              <MenuItem value={allValue}>Уся медіатека</MenuItem>
              <MenuItem value={rootValue}>Без папки</MenuItem>
              {options.map((option) => (
                <MenuItem key={option.id} value={String(option.id)}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Пошук за назвою файлу"
              onChange={(event) => setSearch(event.target.value)}
              value={search}
            />
            <Button
              component="label"
              disabled={uploads.progress !== null}
              startIcon={<UploadOutlinedIcon />}
              sx={{ flexShrink: 0 }}
              variant="outlined"
            >
              {uploads.progress
                ? `Завантаження ${uploads.progress.done} / ${uploads.progress.total}`
                : 'Завантажити з комп’ютера'}
              <input
                accept={mediaAcceptedTypes.join(',')}
                hidden
                multiple
                onChange={pick}
                type="file"
              />
            </Button>
          </Stack>
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
      <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
        <Typography color={tooMany ? 'error' : 'text.secondary'} variant="body2">
          {tooMany
            ? `За раз можна додати до ${galleryPhotosPerAdd} фото.`
            : selected.length > 0
              ? `Вибрано: ${selected.length}. Додадуться в кінець у порядку вибору.`
              : 'Натисніть на фото, щоб вибрати.'}
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button disabled={adding} onClick={close}>
            Скасувати
          </Button>
          <Button
            disabled={adding || selected.length === 0 || tooMany || uploads.progress !== null}
            onClick={() => onAdd(selected)}
            variant="contained"
          >
            {adding ? 'Додавання…' : 'Додати в галерею'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
