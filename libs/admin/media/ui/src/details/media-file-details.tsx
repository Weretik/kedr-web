import { fileNameIssue, mediaAcceptedTypes } from '@admin/media/model';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { Alert, Button, Divider, IconButton, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { MediaFileFacts } from './media-file-facts';
import { MediaFilePreview } from './media-file-preview';
import { MediaFolderSelect } from '../forms/media-folder-select';

import type { MediaFile, MediaFolder } from '@admin/media/model';
import type { ChangeEvent, FormEvent } from 'react';

export interface MediaFilePanelProps {
  file: MediaFile | null;
  folders: readonly MediaFolder[];
  busy: boolean;
  error?: string;
  /** Without it the role may not delete and the button is hidden. */
  onDelete?: (file: MediaFile) => void;
  onClose: () => void;
  onSave: (file: MediaFile, value: { fileName: string; folderId: number | null }) => void;
  onReplace: (file: MediaFile, picture: File) => void;
  onCopyUrl: (file: MediaFile) => void;
}

/** The form and actions of one file inside its side panel. */
export function MediaFileDetails({
  busy,
  error,
  file,
  folders,
  onClose,
  onCopyUrl,
  onDelete,
  onReplace,
  onSave,
}: MediaFilePanelProps & { file: MediaFile }) {
  const [fileName, setFileName] = useState(file.fileName);
  const [folderId, setFolderId] = useState<number | null>(file.folderId);

  const issue = fileNameIssue(fileName);
  const changed = fileName.trim() !== file.fileName || folderId !== file.folderId;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (changed && !issue) onSave(file, { fileName: fileName.trim(), folderId });
  };
  const pick = (event: ChangeEvent<HTMLInputElement>) => {
    const picture = event.target.files?.[0];
    // Reset so choosing the same file again still fires a change.
    event.target.value = '';
    if (picture) onReplace(file, picture);
  };

  return (
    <Stack component="form" noValidate onSubmit={submit} spacing={2} sx={{ p: 3 }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography component="h2" variant="h6">
          Файл
        </Typography>
        <IconButton aria-label="Закрити" disabled={busy} onClick={onClose}>
          <CloseOutlinedIcon />
        </IconButton>
      </Stack>
      <MediaFilePreview file={file} onCopyUrl={() => onCopyUrl(file)} />
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField
        disabled={busy}
        error={Boolean(issue)}
        fullWidth
        helperText={issue ?? 'Назва в адмінці; посилання на файл від неї не залежить.'}
        label="Назва"
        onChange={(event) => setFileName(event.target.value)}
        size="small"
        value={fileName}
      />
      <MediaFolderSelect
        disabled={busy}
        folders={folders}
        label="Папка"
        onChange={setFolderId}
        value={folderId}
      />
      <Button disabled={busy || !changed || Boolean(issue)} type="submit" variant="contained">
        {busy ? 'Збереження…' : 'Зберегти'}
      </Button>
      <Divider />
      <MediaFileFacts file={file} folders={folders} />
      <Divider />
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
        <Button component="label" disabled={busy} variant="outlined">
          Замінити файл
          <input accept={mediaAcceptedTypes.join(',')} hidden onChange={pick} type="file" />
        </Button>
        {onDelete ? (
          <Button
            color="error"
            disabled={busy}
            onClick={() => onDelete(file)}
            startIcon={<DeleteOutlinedIcon />}
          >
            Видалити
          </Button>
        ) : null}
      </Stack>
      <Typography color="text.secondary" variant="caption">
        Заміна залишає файл на його місцях у бібліотеці й товарах, але дає йому нове посилання.
        Видалення прибирає файл із CDN назавжди.
      </Typography>
    </Stack>
  );
}
