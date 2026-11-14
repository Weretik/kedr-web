import { Button, Stack, Typography } from '@mui/material';

import { AttributeSwatch } from '../components/swatch/attribute-swatch';

import type { UploadedSwatch } from '@admin/catalog-attributes/model';

const pictureTypes = 'image/jpeg,image/png,image/webp';

interface TextureSwatchFieldProps {
  texture: UploadedSwatch | null;
  uploading: boolean;
  onPickTexture: () => void;
  onUploadTexture?: (file: File) => void;
}

/** A decor picture uploaded from the computer or chosen in «Медіа». */
export function TextureSwatchField({
  onPickTexture,
  onUploadTexture,
  texture,
  uploading,
}: TextureSwatchFieldProps) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1 }}>
      {texture ? (
        <AttributeSwatch hex={null} imageUrl={texture.url} label="Картинка" size={44} />
      ) : (
        <Typography color="error" variant="body2">
          Картинку не вибрано.
        </Typography>
      )}
      {onUploadTexture ? (
        <Button component="label" disabled={uploading} variant="outlined">
          {uploading ? 'Завантаження…' : 'Завантажити з комп’ютера'}
          <input
            accept={pictureTypes}
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (file) onUploadTexture(file);
            }}
            type="file"
          />
        </Button>
      ) : null}
      <Button disabled={uploading} onClick={onPickTexture} variant="outlined">
        Вибрати з медіатеки
      </Button>
    </Stack>
  );
}
