import { useGetMediaFilesQuery, useGetMediaFoldersQuery } from '@admin/media/data-access';
import { mediaAcceptedTypes, uploadFolderId } from '@admin/media/model';
import {
  ConfirmMediaDeleteDialog,
  MediaDropZone,
  MediaFileGrid,
  MediaFilePanel,
  MediaFolderDialog,
  MoveMediaFilesDialog,
} from '@admin/media/ui';
import { AdminPageHeader, NoticeSnackbar, PageIssues } from '@admin/shared/ui';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Box, Button, Card, Pagination, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { MediaFilesToolbar } from '../components/media-files-toolbar';
import { MediaFoldersCard } from '../components/media-folders-card';
import { useMediaFileActions } from '../hooks/use-media-file-actions';
import { useMediaFilesQuery } from '../hooks/use-media-files-query';
import { useMediaFolderActions } from '../hooks/use-media-folder-actions';
import { useMediaSelection } from '../hooks/use-media-selection';
import { useMediaUploads } from '../hooks/use-media-uploads';

import type { MediaFolderTree } from '@admin/media/model';
import type { ChangeEvent } from 'react';

const emptyTree: MediaFolderTree = { folders: [], rootFileCount: 0, totalFileCount: 0 };

interface MediaPageProps {
  /** Only an Admin deletes files and folders, as the backend policy. */
  canDelete: boolean;
}

/** The shared picture library on the CDN: folders on the left, the grid with search on the right. */
export function MediaPage({ canDelete }: MediaPageProps) {
  const [notice, setNotice] = useState<string | null>(null);
  const filesQuery = useMediaFilesQuery();
  const folders = useGetMediaFoldersQuery();
  const files = useGetMediaFilesQuery(filesQuery.query);
  const tree = folders.data ?? emptyTree;
  const selection = useMediaSelection();
  const folderActions = useMediaFolderActions({
    scope: filesQuery.scope,
    onScopeChange: filesQuery.setScope,
    onNotice: setNotice,
  });
  const fileActions = useMediaFileActions(setNotice);
  const uploads = useMediaUploads((count) => setNotice(`Завантажено файлів: ${count}.`));

  const { clear } = selection;
  useEffect(() => clear(), [clear, filesQuery.query]);

  const targetId = uploadFolderId(filesQuery.scope);
  const targetName = tree.folders.find((folder) => folder.id === targetId)?.name;
  const targetLabel = targetName ? `у папку «${targetName}»` : 'у корінь бібліотеки';
  const startUpload = (picked: readonly File[]) => uploads.upload(picked, targetId);
  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (picked.length > 0) void startUpload(picked);
  };

  const page = files.data;
  const pageCount = page ? Math.ceil(page.totalCount / page.pageSize) : 0;
  const folderDialog = folderActions.dialog;

  return (
    <Stack component="section" spacing={3}>
      <AdminPageHeader
        actions={
          <>
            <Button
              onClick={() => folderActions.openCreate(targetId)}
              startIcon={<CreateNewFolderOutlinedIcon />}
              variant="outlined"
            >
              Нова папка
            </Button>
            <Button
              component="label"
              disabled={uploads.progress !== null}
              startIcon={<UploadOutlinedIcon />}
              variant="contained"
            >
              Завантажити
              <input
                accept={mediaAcceptedTypes.join(',')}
                hidden
                multiple
                onChange={pick}
                type="file"
              />
            </Button>
          </>
        }
        title="Медіа"
      />
      <Typography color="text.secondary" variant="body2">
        Фото товарів, схеми та інші зображення сайту на CDN. Папки лише для порядку: переміщення не
        змінює посилання на файл. JPEG, PNG або WebP до 15 МБ; файли можна перетягнути на сітку.
      </Typography>
      <PageIssues
        messages={uploads.issues}
        revealKey={uploads.issues.join('|')}
        title="Не всі файли завантажено"
      />
      <Box
        sx={{
          alignItems: 'start',
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '280px minmax(0, 1fr)' },
        }}
      >
        <MediaFoldersCard
          error={folders.isError}
          loading={folders.isLoading}
          onCreateChild={(parent) => folderActions.openCreate(parent.id)}
          onDelete={canDelete ? folderActions.openDelete : undefined}
          onEdit={folderActions.openEdit}
          onRetry={() => folders.refetch()}
          onSelect={filesQuery.setScope}
          scope={filesQuery.scope}
          tree={folders.data}
        />
        <Card sx={{ p: 2 }} variant="outlined">
          <MediaDropZone
            disabled={uploads.progress !== null}
            onFiles={(dropped) => void startUpload(dropped)}
            targetLabel={targetLabel}
          >
            <Stack spacing={2}>
              <MediaFilesToolbar
                onClearSelection={selection.clear}
                onMove={fileActions.moving.show}
                onSearch={filesQuery.setSearch}
                progress={uploads.progress}
                search={filesQuery.search}
                selectedCount={selection.selectedIds.size}
                totalCount={page?.totalCount}
              />
              <MediaFileGrid
                emptyText={
                  filesQuery.query.search
                    ? 'Нічого не знайдено. Змініть пошук.'
                    : 'Тут ще немає файлів. Завантажте або перетягніть фото.'
                }
                error={files.isError}
                files={page?.items ?? []}
                loading={files.isFetching}
                onOpen={fileActions.panel.open}
                onRetry={() => files.refetch()}
                onToggle={(file) => selection.toggle(file.id)}
                selectedIds={selection.selectedIds}
              />
              {pageCount > 1 ? (
                <Pagination
                  count={pageCount}
                  onChange={(_event, next) => filesQuery.setPage(next)}
                  page={filesQuery.query.page}
                  sx={{ alignSelf: 'center' }}
                />
              ) : null}
            </Stack>
          </MediaDropZone>
        </Card>
      </Box>
      <MediaFilePanel
        busy={fileActions.panel.busy}
        error={fileActions.panel.error}
        file={fileActions.panel.file}
        folders={tree.folders}
        onClose={fileActions.panel.close}
        onCopyUrl={(file) =>
          void navigator.clipboard
            ?.writeText(file.url)
            .then(() => setNotice('Посилання скопійовано.'))
        }
        onDelete={canDelete ? fileActions.deletion.ask : undefined}
        onReplace={fileActions.panel.replace}
        onSave={fileActions.panel.save}
      />
      <MediaFolderDialog
        error={folderActions.error}
        folder={folderDialog?.kind === 'edit' ? folderDialog.folder : undefined}
        folders={tree.folders}
        initialParentId={folderDialog?.kind === 'create' ? folderDialog.parentId : null}
        onCancel={folderActions.close}
        onSubmit={folderActions.save}
        open={folderDialog?.kind === 'create' || folderDialog?.kind === 'edit'}
        saving={folderActions.saving}
      />
      <ConfirmMediaDeleteDialog
        deleting={folderActions.deleting}
        error={folderActions.error}
        onCancel={folderActions.close}
        onConfirm={folderActions.remove}
        open={folderDialog?.kind === 'delete'}
        text={
          folderDialog?.kind === 'delete'
            ? `Папку «${folderDialog.folder.name}» буде видалено. Видалити можна лише порожню папку.`
            : ''
        }
        title="Видалити папку?"
      />
      <ConfirmMediaDeleteDialog
        deleting={fileActions.deletion.deleting}
        error={fileActions.deletion.error}
        onCancel={fileActions.deletion.cancel}
        onConfirm={fileActions.deletion.confirm}
        open={fileActions.deletion.file !== null}
        text={`«${fileActions.deletion.file?.fileName ?? ''}» буде видалено з CDN назавжди. Сайт і товари, що його показують, залишаться без цього фото.`}
        title="Видалити файл?"
      />
      <MoveMediaFilesDialog
        count={selection.selectedIds.size}
        error={fileActions.moving.error}
        folders={tree.folders}
        moving={fileActions.moving.busy}
        onCancel={fileActions.moving.cancel}
        onConfirm={(folderId) =>
          fileActions.moving.move([...selection.selectedIds], folderId, selection.clear)
        }
        open={fileActions.moving.open}
      />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default MediaPage;
