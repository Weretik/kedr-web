import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { MediaFileGrid } from '../components/file-grid/media-file-grid';

import type { MediaFile } from '@admin/media/model';

interface MediaPickerDialogProps {
  open: boolean;
  title: string;
  /** Several files (photos) or one (a scheme). */
  multiple: boolean;
  files: readonly MediaFile[];
  loading: boolean;
  error: boolean;
  search: string;
  page: number;
  pageCount: number;
  onSearchChange: (search: string) => void;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onCancel: () => void;
  /** Files in the order they were clicked. */
  onConfirm: (files: MediaFile[]) => void;
}

/** Picks pictures from the library: search by name, click to select, then «Додати». */
export function MediaPickerDialog({ onCancel, open, title, ...content }: MediaPickerDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" onClose={onCancel} open={open}>
      <DialogTitle>{title}</DialogTitle>
      {/* Mounted only while open, so every opening starts with an empty selection. */}
      {open && <PickerContent onCancel={onCancel} {...content} />}
    </Dialog>
  );
}

function PickerContent({
  error,
  files,
  loading,
  multiple,
  onCancel,
  onConfirm,
  onPageChange,
  onRetry,
  onSearchChange,
  page,
  pageCount,
  search,
}: Omit<MediaPickerDialogProps, 'open' | 'title'>) {
  const [selected, setSelected] = useState<MediaFile[]>([]);
  const selectedIds = new Set(selected.map((file) => file.id));
  const toggle = (file: MediaFile) =>
    setSelected((current) => {
      if (current.some((item) => item.id === file.id))
        return current.filter((item) => item.id !== file.id);
      return multiple ? [...current, file] : [file];
    });

  return (
    <>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Пошук за назвою файлу"
            onChange={(event) => onSearchChange(event.target.value)}
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
            value={search}
          />
          <MediaFileGrid
            emptyText={search ? 'Нічого не знайдено.' : 'У бібліотеці ще немає файлів.'}
            error={error}
            files={files}
            loading={loading}
            onOpen={toggle}
            onRetry={onRetry}
            onToggle={toggle}
            selectedIds={selectedIds}
          />
          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              onChange={(_event, value) => onPageChange(value)}
              page={page}
              sx={{ alignSelf: 'center' }}
            />
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Typography color="text.secondary" sx={{ mr: 'auto', pl: 1 }} variant="body2">
          {selected.length > 0
            ? `Вибрано: ${selected.length}`
            : multiple
              ? 'Виберіть один або кілька файлів'
              : 'Виберіть файл'}
        </Typography>
        <Button onClick={onCancel}>Скасувати</Button>
        <Button
          disabled={selected.length === 0}
          onClick={() => onConfirm(selected)}
          variant="contained"
        >
          Додати
        </Button>
      </DialogActions>
    </>
  );
}
