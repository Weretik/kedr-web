import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { productMediaGrid } from './product-media-grid';
import { ProductMediaTile } from './product-media-tile';

import type { ProductMedia } from '@admin/products/model';
import type { ChangeEvent } from 'react';

interface ProductPhotosSectionProps {
  photos: ProductMedia['photos'];
  maxPhotos: number;
  accept: string;
  busy: boolean;
  onMove: (index: number, offset: -1 | 1) => void;
  onRemove: (fileId: number) => void;
  onPick: () => void;
  onUpload: (files: File[]) => void;
}

/** Product photos in site order (the first is the main one), picked from «Медіа» or uploaded. */
export function ProductPhotosSection({
  accept,
  busy,
  maxPhotos,
  onMove,
  onPick,
  onRemove,
  onUpload,
  photos,
}: ProductPhotosSectionProps) {
  const input = useRef<HTMLInputElement>(null);
  const full = photos.length >= maxPhotos;
  const readFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    return files;
  };

  return (
    <Stack spacing={1.5}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Typography variant="subtitle2">
          Фото ({photos.length} з {maxPhotos})
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button
            disabled={busy || full}
            onClick={onPick}
            size="small"
            startIcon={<PhotoLibraryOutlinedIcon />}
          >
            З бібліотеки
          </Button>
          <Button
            disabled={busy || full}
            onClick={() => input.current?.click()}
            size="small"
            startIcon={<UploadOutlinedIcon />}
          >
            Завантажити
          </Button>
        </Stack>
      </Stack>
      {photos.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Фото не додано. Товар показується без фото.
        </Typography>
      ) : (
        <Box sx={productMediaGrid}>
          {photos.map((photo, index) => (
            <ProductMediaTile
              badge={index === 0 ? 'Головне' : undefined}
              disabled={busy}
              item={photo}
              key={photo.id}
              onMoveBack={index > 0 ? () => onMove(index, -1) : undefined}
              onMoveForward={index < photos.length - 1 ? () => onMove(index, 1) : undefined}
              onRemove={() => onRemove(photo.id)}
            />
          ))}
        </Box>
      )}
      <input
        accept={accept}
        aria-label="Файли фото товару"
        hidden
        multiple
        onChange={(event) => onUpload(readFiles(event))}
        ref={input}
        type="file"
      />
    </Stack>
  );
}
