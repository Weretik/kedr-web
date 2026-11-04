import { folderAndDescendantIds, folderNameIssue } from '@admin/media/model';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useMemo, useState } from 'react';

import { MediaFolderSelect } from '../forms/media-folder-select';

import type { MediaFolder } from '@admin/media/model';
import type { FormEvent } from 'react';

export interface MediaFolderDialogValue {
  name: string;
  parentId: number | null;
}

interface MediaFolderDialogProps {
  open: boolean;
  /** The folder being edited; without it the dialog creates a folder. */
  folder?: MediaFolder;
  /** Parent preselected for a new folder. */
  initialParentId?: number | null;
  folders: readonly MediaFolder[];
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (value: MediaFolderDialogValue) => void;
}

/** Creates a folder, or renames and moves one: a folder cannot go into itself or its subfolders. */
export function MediaFolderDialog(props: MediaFolderDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      onClose={props.saving ? undefined : props.onCancel}
      open={props.open}
    >
      {/* The form mounts on every open, so it starts from the folder being edited. */}
      <MediaFolderForm {...props} />
    </Dialog>
  );
}

function MediaFolderForm({
  error,
  folder,
  folders,
  initialParentId = null,
  onCancel,
  onSubmit,
  saving,
}: MediaFolderDialogProps) {
  const [name, setName] = useState(folder?.name ?? '');
  const [parentId, setParentId] = useState<number | null>(
    folder ? folder.parentId : initialParentId,
  );
  const [touched, setTouched] = useState(false);

  const blocked = useMemo(
    () => (folder ? folderAndDescendantIds(folders, folder.id) : undefined),
    [folder, folders],
  );
  const issue = folderNameIssue(name);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (!issue) onSubmit({ name: name.trim(), parentId });
  };

  return (
    <form noValidate onSubmit={submit}>
      <DialogTitle>{folder ? 'Змінити папку' : 'Нова папка'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            error={touched && Boolean(issue)}
            fullWidth
            helperText={touched ? issue : undefined}
            label="Назва"
            onChange={(event) => setName(event.target.value)}
            size="small"
            value={name}
          />
          <MediaFolderSelect
            disabledIds={blocked}
            folders={folders}
            label="Розташування"
            onChange={setParentId}
            value={parentId}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button disabled={saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : folder ? 'Зберегти' : 'Створити'}
        </Button>
      </DialogActions>
    </form>
  );
}
