import {
  useDeleteMediaFileMutation,
  useMoveMediaFilesMutation,
  useReplaceMediaFileMutation,
  useUpdateMediaFileMutation,
} from '@admin/media/data-access';
import { uploadIssue } from '@admin/media/model';
import { useState } from 'react';

import { mediaErrorMessage } from '../errors/media-error-message';

import type { MediaFile } from '@admin/media/model';

/**
 * The open file in the side panel and what can be done with it, plus the bulk move.
 * The panel keeps its own copy of the file so a save or replace shows the new data at once.
 */
export function useMediaFileActions(onNotice: (message: string) => void) {
  const [openFile, setOpenFile] = useState<MediaFile | null>(null);
  const [panelError, setPanelError] = useState<string>();
  const [confirmDelete, setConfirmDelete] = useState<MediaFile | null>(null);
  const [deleteError, setDeleteError] = useState<string>();
  const [moveOpen, setMoveOpen] = useState(false);
  const [moveError, setMoveError] = useState<string>();

  const [updateFile, updateState] = useUpdateMediaFileMutation();
  const [replaceFile, replaceState] = useReplaceMediaFileMutation();
  const [deleteFile, deleteState] = useDeleteMediaFileMutation();
  const [moveFiles, moveState] = useMoveMediaFilesMutation();

  const open = (file: MediaFile) => {
    setPanelError(undefined);
    setOpenFile(file);
  };

  const save = async (file: MediaFile, value: { fileName: string; folderId: number | null }) => {
    setPanelError(undefined);
    try {
      setOpenFile(await updateFile({ id: file.id, ...value }).unwrap());
      onNotice('Файл збережено.');
    } catch (error) {
      setPanelError(mediaErrorMessage(error, 'saveFile'));
    }
  };

  const replace = async (file: MediaFile, picture: File) => {
    const issue = uploadIssue(picture);
    if (issue) return setPanelError(issue);
    setPanelError(undefined);
    try {
      setOpenFile(await replaceFile({ id: file.id, file: picture }).unwrap());
      onNotice('Файл замінено.');
    } catch (error) {
      setPanelError(mediaErrorMessage(error, 'replace'));
    }
  };

  const remove = async () => {
    if (!confirmDelete) return;
    try {
      await deleteFile(confirmDelete.id).unwrap();
      onNotice(`Файл «${confirmDelete.fileName}» видалено.`);
      setConfirmDelete(null);
      setOpenFile(null);
    } catch (error) {
      setDeleteError(mediaErrorMessage(error, 'deleteFile'));
    }
  };

  const move = async (fileIds: number[], folderId: number | null, onMoved: () => void) => {
    setMoveError(undefined);
    try {
      const moved = await moveFiles({ fileIds, folderId }).unwrap();
      onNotice(`Переміщено файлів: ${moved}.`);
      setMoveOpen(false);
      onMoved();
    } catch (error) {
      setMoveError(mediaErrorMessage(error, 'move'));
    }
  };

  return {
    panel: {
      file: openFile,
      error: panelError,
      busy: updateState.isLoading || replaceState.isLoading,
      open,
      close: () => setOpenFile(null),
      save,
      replace,
    },
    deletion: {
      file: confirmDelete,
      error: deleteError,
      deleting: deleteState.isLoading,
      ask: (file: MediaFile) => {
        setDeleteError(undefined);
        setConfirmDelete(file);
      },
      cancel: () => setConfirmDelete(null),
      confirm: remove,
    },
    moving: {
      open: moveOpen,
      error: moveError,
      busy: moveState.isLoading,
      show: () => {
        setMoveError(undefined);
        setMoveOpen(true);
      },
      cancel: () => setMoveOpen(false),
      move,
    },
  };
}
