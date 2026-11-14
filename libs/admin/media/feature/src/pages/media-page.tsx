import { useGetMediaFilesQuery, useGetMediaFoldersQuery } from '@admin/media/data-access';
import { mediaAcceptedTypes, uploadFolderId } from '@admin/media/model';
import { AdminPageHeader, NoticeSnackbar, PageIssues } from '@admin/shared/ui';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { MediaFilesCard } from '../components/media-files-card';
import { MediaFoldersCard } from '../components/media-folders-card';
import { MediaLibraryDialogs } from '../components/media-library-dialogs';
import { useMediaFileActions } from '../hooks/use-media-file-actions';
import { useMediaFilesQuery } from '../hooks/use-media-files-query';
import { useMediaFolderActions } from '../hooks/use-media-folder-actions';
import { useMediaFolderExpansion } from '../hooks/use-media-folder-expansion';
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
  const expansion = useMediaFolderExpansion(tree.folders, filesQuery.scope);
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
          gridTemplateColumns: { xs: '1fr', md: '320px minmax(0, 1fr)' },
        }}
      >
        <MediaFoldersCard
          error={folders.isError}
          expandedIds={expansion.expandedIds}
          loading={folders.isLoading}
          onCreateChild={(parent) => folderActions.openCreate(parent.id)}
          onDelete={canDelete ? folderActions.openDelete : undefined}
          onEdit={folderActions.openEdit}
          onRetry={() => folders.refetch()}
          onSelect={filesQuery.setScope}
          onToggle={expansion.toggle}
          scope={filesQuery.scope}
          tree={folders.data}
        />
        <MediaFilesCard
          error={files.isError}
          fileActions={fileActions}
          filesQuery={filesQuery}
          folders={tree.folders}
          loading={files.isFetching}
          onRetry={() => files.refetch()}
          onUpload={(dropped) => void startUpload(dropped)}
          page={files.data}
          selection={selection}
          targetLabel={targetLabel}
          uploads={uploads}
        />
      </Box>
      <MediaLibraryDialogs
        canDelete={canDelete}
        fileActions={fileActions}
        folderActions={folderActions}
        folders={tree.folders}
        onNotice={setNotice}
        selection={selection}
      />
      <NoticeSnackbar message={notice} onClose={() => setNotice(null)} />
    </Stack>
  );
}

export default MediaPage;
