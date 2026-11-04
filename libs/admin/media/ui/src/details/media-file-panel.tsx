import {
  fileNameIssue,
  folderPath,
  formatDimensions,
  formatFileSize,
  mediaAcceptedTypes,
} from '@admin/media/model';
import { DetailField, DetailFieldList } from '@admin/shared/ui';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import {
  Alert,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { MediaFolderSelect } from '../forms/media-folder-select';

import type { MediaFile, MediaFolder } from '@admin/media/model';
import type { ChangeEvent, FormEvent } from 'react';

interface MediaFilePanelProps {
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

const dateTime = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

/** Side panel of one file: preview, link, name and folder, replace, and delete. */
export function MediaFilePanel({ file, ...props }: MediaFilePanelProps) {
  return (
    <Drawer
      anchor="right"
      onClose={props.busy ? undefined : props.onClose}
      open={file !== null}
      slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}
    >
      {/* A new key after a save or replace restarts the form from the saved file. */}
      {file ? (
        <MediaFileDetails file={file} key={`${file.id}:${file.updatedAt}`} {...props} />
      ) : null}
    </Drawer>
  );
}

function MediaFileDetails({
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
      <Box
        sx={{
          alignItems: 'center',
          aspectRatio: '4 / 3',
          bgcolor: 'action.hover',
          borderRadius: 2,
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          alt={file.fileName}
          component="img"
          src={file.url}
          sx={{ height: '100%', objectFit: 'contain', width: '100%' }}
        />
      </Box>
      <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
        <Button
          href={file.url}
          rel="noreferrer"
          size="small"
          startIcon={<OpenInNewOutlinedIcon />}
          target="_blank"
        >
          Відкрити
        </Button>
        <Button
          onClick={() => onCopyUrl(file)}
          size="small"
          startIcon={<ContentCopyOutlinedIcon />}
        >
          Копіювати посилання
        </Button>
      </Stack>
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
      <DetailFieldList>
        <DetailField
          label="Розташування"
          value={['Медіа', ...folderPath(folders, file.folderId)].join(' / ')}
        />
        <DetailField label="Тип" value={file.contentType} />
        <DetailField label="Розмір" value={formatFileSize(file.sizeBytes)} />
        <DetailField
          label="Роздільність"
          value={formatDimensions(file.width, file.height) ?? 'невідома'}
        />
        <DetailField label="Додано" value={dateTime.format(new Date(file.createdAt))} />
        <DetailField label="Змінено" value={dateTime.format(new Date(file.updatedAt))} />
      </DetailFieldList>
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
