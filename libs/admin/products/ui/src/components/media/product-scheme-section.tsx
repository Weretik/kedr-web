import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import UploadOutlinedIcon from '@mui/icons-material/UploadOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';
import { useRef } from 'react';

import { productMediaGrid } from './product-media-grid';
import { ProductMediaTile } from './product-media-tile';

import type { ProductMedia } from '@admin/products/model';
import type { ChangeEvent } from 'react';

interface ProductSchemeSectionProps {
  scheme: ProductMedia['scheme'];
  accept: string;
  busy: boolean;
  onRemove: () => void;
  onPick: () => void;
  onUpload: (file: File) => void;
}

/** The product scheme, picked from «Медіа» or uploaded. */
export function ProductSchemeSection({
  accept,
  busy,
  onPick,
  onRemove,
  onUpload,
  scheme,
}: ProductSchemeSectionProps) {
  const input = useRef<HTMLInputElement>(null);
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
        <Typography variant="subtitle2">Схема</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            disabled={busy}
            onClick={onPick}
            size="small"
            startIcon={<AddPhotoAlternateOutlinedIcon />}
          >
            {scheme ? 'Замінити з бібліотеки' : 'З бібліотеки'}
          </Button>
          <Button
            disabled={busy}
            onClick={() => input.current?.click()}
            size="small"
            startIcon={<UploadOutlinedIcon />}
          >
            Завантажити
          </Button>
        </Stack>
      </Stack>
      {scheme ? (
        <Box sx={productMediaGrid}>
          <ProductMediaTile disabled={busy} item={scheme} onRemove={onRemove} />
        </Box>
      ) : (
        <Typography color="text.secondary" variant="body2">
          Схему не додано.
        </Typography>
      )}
      <input
        accept={accept}
        aria-label="Файл схеми товару"
        hidden
        onChange={(event) => {
          const [file] = readFiles(event);
          if (file) onUpload(file);
        }}
        ref={input}
        type="file"
      />
    </Stack>
  );
}
