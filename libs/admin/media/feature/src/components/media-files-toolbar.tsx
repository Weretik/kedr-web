import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Button,
  InputAdornment,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { UploadProgress } from '../hooks/use-media-uploads';

interface MediaFilesToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  selectedCount: number;
  totalCount: number | undefined;
  progress: UploadProgress | null;
  onMove: () => void;
  onClearSelection: () => void;
}

/** Search, the selection actions or the file count, and upload progress above the grid. */
export function MediaFilesToolbar({
  onClearSelection,
  onMove,
  onSearch,
  progress,
  search,
  selectedCount,
  totalCount,
}: MediaFilesToolbarProps) {
  return (
    <Stack spacing={2}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <TextField
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Пошук за назвою"
          size="small"
          slotProps={{
            htmlInput: { 'aria-label': 'Пошук файлів' },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: { xs: '100%', sm: 320 } }}
          value={search}
        />
        {selectedCount > 0 ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Typography variant="subtitle2">Вибрано: {selectedCount}</Typography>
            <Button onClick={onMove} size="small" variant="outlined">
              Перемістити
            </Button>
            <Button onClick={onClearSelection} size="small">
              Скасувати
            </Button>
          </Stack>
        ) : totalCount !== undefined ? (
          <Typography color="text.secondary" variant="body2">
            Файлів: {totalCount}
          </Typography>
        ) : null}
      </Stack>
      {progress ? (
        <Stack spacing={0.5}>
          <Typography variant="body2">
            Завантаження {Math.min(progress.done + 1, progress.total)} з {progress.total}…
          </Typography>
          <LinearProgress value={(progress.done / progress.total) * 100} variant="determinate" />
        </Stack>
      ) : null}
    </Stack>
  );
}
