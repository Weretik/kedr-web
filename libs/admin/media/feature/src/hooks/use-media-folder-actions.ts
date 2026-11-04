import {
  useCreateMediaFolderMutation,
  useDeleteMediaFolderMutation,
  useUpdateMediaFolderMutation,
} from '@admin/media/data-access';
import { useState } from 'react';

import { mediaErrorMessage } from '../errors/media-error-message';

import type { MediaFolder, MediaScope } from '@admin/media/model';
import type { MediaFolderDialogValue } from '@admin/media/ui';

type FolderDialog =
  | { kind: 'create'; parentId: number | null }
  | { kind: 'edit'; folder: MediaFolder }
  | { kind: 'delete'; folder: MediaFolder }
  | null;

interface FolderActionsOptions {
  scope: MediaScope;
  onScopeChange: (scope: MediaScope) => void;
  onNotice: (message: string) => void;
}

/** Create, rename or move, and delete a folder through one dialog at a time. */
export function useMediaFolderActions({ onNotice, onScopeChange, scope }: FolderActionsOptions) {
  const [dialog, setDialog] = useState<FolderDialog>(null);
  const [error, setError] = useState<string>();
  const [createFolder, createState] = useCreateMediaFolderMutation();
  const [updateFolder, updateState] = useUpdateMediaFolderMutation();
  const [deleteFolder, deleteState] = useDeleteMediaFolderMutation();

  const open = (next: FolderDialog) => {
    setError(undefined);
    setDialog(next);
  };

  const save = async (value: MediaFolderDialogValue) => {
    if (!dialog || dialog.kind === 'delete') return;
    try {
      if (dialog.kind === 'create') {
        const created = await createFolder(value).unwrap();
        onScopeChange({ kind: 'folder', folderId: created.id });
        onNotice(`Папку «${created.name}» створено.`);
      } else {
        await updateFolder({ id: dialog.folder.id, ...value }).unwrap();
        onNotice('Папку збережено.');
      }
      setDialog(null);
    } catch (caught) {
      setError(mediaErrorMessage(caught, 'saveFolder'));
    }
  };

  const remove = async () => {
    if (dialog?.kind !== 'delete') return;
    try {
      await deleteFolder(dialog.folder.id).unwrap();
      if (scope.kind === 'folder' && scope.folderId === dialog.folder.id)
        onScopeChange({ kind: 'all' });
      onNotice(`Папку «${dialog.folder.name}» видалено.`);
      setDialog(null);
    } catch (caught) {
      setError(mediaErrorMessage(caught, 'deleteFolder'));
    }
  };

  return {
    dialog,
    error,
    saving: createState.isLoading || updateState.isLoading,
    deleting: deleteState.isLoading,
    openCreate: (parentId: number | null) => open({ kind: 'create', parentId }),
    openEdit: (folder: MediaFolder) => open({ kind: 'edit', folder }),
    openDelete: (folder: MediaFolder) => open({ kind: 'delete', folder }),
    close: () => setDialog(null),
    save,
    remove,
  };
}
