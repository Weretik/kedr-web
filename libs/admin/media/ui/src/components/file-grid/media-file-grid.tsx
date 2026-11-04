import ImageNotSupportedOutlinedIcon from '@mui/icons-material/ImageNotSupportedOutlined';
import { Alert, Box, Button, Skeleton, Stack, Typography } from '@mui/material';

import { MediaFileCard } from './media-file-card';

import type { MediaFile } from '@admin/media/model';

interface MediaFileGridProps {
  files: readonly MediaFile[];
  loading: boolean;
  error: boolean;
  /** Shown when there are no files: differs for a search and for an empty folder. */
  emptyText: string;
  selectedIds: ReadonlySet<number>;
  onOpen: (file: MediaFile) => void;
  onToggle: (file: MediaFile) => void;
  onRetry: () => void;
}

const columns = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
};

/** The picture grid with loading, error, and empty states in place of the content. */
export function MediaFileGrid({
  emptyText,
  error,
  files,
  loading,
  onOpen,
  onRetry,
  onToggle,
  selectedIds,
}: MediaFileGridProps) {
  if (error)
    return (
      <Alert
        action={
          <Button color="inherit" onClick={onRetry} size="small">
            Повторити
          </Button>
        }
        severity="error"
      >
        Не вдалося завантажити файли.
      </Alert>
    );
  if (loading && files.length === 0)
    return (
      <Box aria-busy="true" aria-label="Завантаження файлів" sx={columns}>
        {Array.from({ length: 12 }, (_, index) => (
          <Skeleton
            key={index}
            sx={{ aspectRatio: '1 / 1', borderRadius: 2, height: 'auto' }}
            variant="rectangular"
          />
        ))}
      </Box>
    );
  if (files.length === 0)
    return (
      <Stack spacing={1} sx={{ alignItems: 'center', color: 'text.secondary', py: 6 }}>
        <ImageNotSupportedOutlinedIcon sx={{ fontSize: 40 }} />
        <Typography variant="body2">{emptyText}</Typography>
      </Stack>
    );
  return (
    <Box sx={{ ...columns, opacity: loading ? 0.6 : 1 }}>
      {files.map((file) => (
        <MediaFileCard
          file={file}
          key={file.id}
          onOpen={onOpen}
          onToggle={onToggle}
          selected={selectedIds.has(file.id)}
          selecting={selectedIds.size > 0}
        />
      ))}
    </Box>
  );
}
