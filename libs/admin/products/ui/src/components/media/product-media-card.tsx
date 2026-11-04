import { SectionCard } from '@admin/shared/ui';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { ProductMediaTile } from './product-media-tile';

import type { ProductMedia } from '@admin/products/model';
import type { ChangeEvent } from 'react';

const grid = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
} as const;

interface ProductMediaCardProps {
  media: ProductMedia;
  maxPhotos: number;
  /** Accepted upload types; the backend checks the content. */
  accept: string;
  busy: boolean;
  error: string | null;
  onMovePhoto: (index: number, offset: -1 | 1) => void;
  onRemovePhoto: (fileId: number) => void;
  onPickPhotos: () => void;
  onUploadPhotos: (files: File[]) => void;
  onPickScheme: () => void;
  onUploadScheme: (file: File) => void;
  onRemoveScheme: () => void;
}

/** Photos (in site order, the first is the main one) and the scheme of a product, from the «Медіа» library. */
export function ProductMediaCard({
  accept,
  busy,
  error,
  maxPhotos,
  media,
  onMovePhoto,
  onPickPhotos,
  onPickScheme,
  onRemovePhoto,
  onRemoveScheme,
  onUploadPhotos,
  onUploadScheme,
}: ProductMediaCardProps) {
  const photoInput = useRef<HTMLInputElement>(null);
  const schemeInput = useRef<HTMLInputElement>(null);
  const full = media.photos.length >= maxPhotos;
  const readFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = '';
    return files;
  };

  return (
    <SectionCard title="Фото та схема">
      {error && <Alert severity="error">{error}</Alert>}
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Typography variant="subtitle2">
            Фото ({media.photos.length} з {maxPhotos})
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button
              disabled={busy || full}
              onClick={onPickPhotos}
              size="small"
              startIcon={<PhotoLibraryOutlinedIcon />}
            >
              З бібліотеки
            </Button>
            <Button
              disabled={busy || full}
              onClick={() => photoInput.current?.click()}
              size="small"
              startIcon={<UploadOutlinedIcon />}
            >
              Завантажити
            </Button>
          </Stack>
        </Stack>
        {media.photos.length === 0 ? (
          <Typography color="text.secondary" variant="body2">
            Фото не додано. Товар показується без фото.
          </Typography>
        ) : (
          <Box sx={grid}>
            {media.photos.map((photo, index) => (
              <ProductMediaTile
                badge={index === 0 ? 'Головне' : undefined}
                disabled={busy}
                item={photo}
                key={photo.id}
                onMoveBack={index > 0 ? () => onMovePhoto(index, -1) : undefined}
                onMoveForward={
                  index < media.photos.length - 1 ? () => onMovePhoto(index, 1) : undefined
                }
                onRemove={() => onRemovePhoto(photo.id)}
              />
            ))}
          </Box>
        )}
      </Stack>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1}
          sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
        >
          <Typography variant="subtitle2">Схема</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              disabled={busy}
              onClick={onPickScheme}
              size="small"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
            >
              {media.scheme ? 'Замінити з бібліотеки' : 'З бібліотеки'}
            </Button>
            <Button
              disabled={busy}
              onClick={() => schemeInput.current?.click()}
              size="small"
              startIcon={<UploadOutlinedIcon />}
            >
              Завантажити
            </Button>
          </Stack>
        </Stack>
        {media.scheme ? (
          <Box sx={grid}>
            <ProductMediaTile disabled={busy} item={media.scheme} onRemove={onRemoveScheme} />
          </Box>
        ) : (
          <Typography color="text.secondary" variant="body2">
            Схему не додано.
          </Typography>
        )}
      </Stack>
      <input
        accept={accept}
        aria-label="Файли фото товару"
        hidden
        multiple
        onChange={(event) => onUploadPhotos(readFiles(event))}
        ref={photoInput}
        type="file"
      />
      <input
        accept={accept}
        aria-label="Файл схеми товару"
        hidden
        onChange={(event) => {
          const [file] = readFiles(event);
          if (file) onUploadScheme(file);
        }}
        ref={schemeInput}
        type="file"
      />
    </SectionCard>
  );
}
