import {
  ConfirmMediaDeleteDialog,
  MediaFilePanel,
  MediaFolderDialog,
  MoveMediaFilesDialog,
} from '@admin/media/ui';

import type { useMediaFileActions } from '../hooks/use-media-file-actions';
import type { useMediaFolderActions } from '../hooks/use-media-folder-actions';
import type { useMediaSelection } from '../hooks/use-media-selection';
import type { MediaFolder } from '@admin/media/model';

interface MediaLibraryDialogsProps {
  folders: readonly MediaFolder[];
  folderActions: ReturnType<typeof useMediaFolderActions>;
  fileActions: ReturnType<typeof useMediaFileActions>;
  selection: ReturnType<typeof useMediaSelection>;
  canDelete: boolean;
  onNotice: (message: string) => void;
}

/** The file panel and every folder and file dialog of the library. */
export function MediaLibraryDialogs({
  canDelete,
  fileActions,
  folderActions,
  folders,
  onNotice,
  selection,
}: MediaLibraryDialogsProps) {
  const folderDialog = folderActions.dialog;
  return (
    <>
      <MediaFilePanel
        busy={fileActions.panel.busy}
        error={fileActions.panel.error}
        file={fileActions.panel.file}
        folders={folders}
        onClose={fileActions.panel.close}
        onCopyUrl={(file) =>
          void navigator.clipboard
            ?.writeText(file.url)
            .then(() => onNotice('Посилання скопійовано.'))
        }
        onDelete={canDelete ? fileActions.deletion.ask : undefined}
        onReplace={fileActions.panel.replace}
        onSave={fileActions.panel.save}
      />
      <MediaFolderDialog
        error={folderActions.error}
        folder={folderDialog?.kind === 'edit' ? folderDialog.folder : undefined}
        folders={folders}
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
        folders={folders}
        moving={fileActions.moving.busy}
        onCancel={fileActions.moving.cancel}
        onConfirm={(folderId) =>
          fileActions.moving.move([...selection.selectedIds], folderId, selection.clear)
        }
        open={fileActions.moving.open}
      />
    </>
  );
}
