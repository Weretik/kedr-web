import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import { useState } from 'react';

import { MediaFolderSelect } from '../forms/media-folder-select';

import type { MediaFolder } from '@admin/media/model';

interface MoveMediaFilesDialogProps {
  open: boolean;
  count: number;
  folders: readonly MediaFolder[];
  moving: boolean;
  error?: string;
  onCancel: () => void;
  onConfirm: (folderId: number | null) => void;
}

/** Moves the selected files to one folder; links to the files stay the same. */
export function MoveMediaFilesDialog(props: MoveMediaFilesDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={props.moving ? undefined : props.onCancel}
      open={props.open}
    >
      {/* The content mounts on every open, so the choice starts from the root each time. */}
      <MoveMediaFilesContent {...props} />
    </Dialog>
  );
}

function MoveMediaFilesContent({
  count,
  error,
  folders,
  moving,
  onCancel,
  onConfirm,
}: MoveMediaFilesDialogProps) {
  const [folderId, setFolderId] = useState<number | null>(null);
  return (
    <>
      <DialogTitle>Перемістити файли</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <DialogContentText>
            Вибрано файлів: {count}. Посилання на них не зміняться.
          </DialogContentText>
          <MediaFolderSelect
            folders={folders}
            label="Куди"
            onChange={setFolderId}
            value={folderId}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={moving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={moving} onClick={() => onConfirm(folderId)} variant="contained">
          {moving ? 'Переміщення…' : 'Перемістити'}
        </Button>
      </DialogActions>
    </>
  );
}
