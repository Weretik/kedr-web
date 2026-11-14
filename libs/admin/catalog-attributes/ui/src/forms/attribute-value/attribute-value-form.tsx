import {
  attributeValueChange,
  attributeValueFormValues,
  checkAttributeValue,
} from '@admin/catalog-attributes/model';
import { Alert, Box, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

import { ColorSwatchField } from './color-swatch-field';
import { SwatchKindField } from './swatch-kind-field';
import { TextureSwatchField } from './texture-swatch-field';

import type {
  AttributeValueFormValues,
  CatalogAttributeValue,
  CatalogAttributeValueChange,
  UploadedSwatch,
} from '@admin/catalog-attributes/model';

/** A color or decor picture: uploaded from the computer or chosen in «Медіа». */
export type SwatchTexture = UploadedSwatch;

interface AttributeValueFormProps {
  /** The value being changed; empty when a person adds one. */
  value: CatalogAttributeValue | null;
  /** The picture uploaded or picked in the library, owned by the page so the picker can set it. */
  texture: SwatchTexture | null;
  saving: boolean;
  /** A picture is being uploaded to the CDN. */
  uploading?: boolean;
  error: string | null;
  onPickTexture: () => void;
  /** Uploads a picture from the computer to the CDN folder `swatches/`. */
  onUploadTexture?: (file: File) => void;
  onCancel: () => void;
  onSave: (change: CatalogAttributeValueChange) => void;
}

/**
 * Name, order, and swatch of one value (a color, a picture of the finish, or only text), edited in place inside the
 * values list of the attribute panel. The picture is uploaded from the computer or chosen in «Медіа».
 */
export function AttributeValueForm({
  error,
  onCancel,
  onPickTexture,
  onSave,
  onUploadTexture,
  saving,
  texture,
  uploading = false,
  value,
}: AttributeValueFormProps) {
  const [values, setValues] = useState(() => attributeValueFormValues(value));
  const { hexValid, nameValid, orderValid, valid } = checkAttributeValue(values, texture);
  const canSave = !saving && !uploading && valid;
  const change = (patch: Partial<AttributeValueFormValues>) =>
    setValues((current) => ({ ...current, ...patch }));

  return (
    <Box
      aria-label={value ? `Значення ${value.nameUk}` : 'Нове значення'}
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (canSave) onSave(attributeValueChange(values, texture));
      }}
      sx={{
        bgcolor: 'background.default',
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
          <TextField
            error={!nameValid && values.nameUk !== ''}
            fullWidth
            label="Назва українською"
            onChange={(event) => change({ nameUk: event.target.value })}
            required
            size="small"
            value={values.nameUk}
          />
          <TextField
            fullWidth
            label="Назва російською"
            onChange={(event) => change({ nameRu: event.target.value })}
            size="small"
            value={values.nameRu}
          />
        </Stack>
        <TextField
          size="small"
          sx={{ maxWidth: 220 }}
          error={!orderValid}
          helperText={orderValid ? 'Менше число — вище у списку' : 'Ціле число від 0.'}
          label="Порядок"
          onChange={(event) => change({ sortOrder: event.target.value })}
          slotProps={{ htmlInput: { inputMode: 'numeric' } }}
          value={values.sortOrder}
        />
        <SwatchKindField kind={values.kind} onChange={(kind) => change({ kind })} />
        {values.kind === 'color' ? (
          <ColorSwatchField
            hex={values.hex}
            hexValid={hexValid}
            onChange={(hex) => change({ hex })}
          />
        ) : null}
        {values.kind === 'texture' ? (
          <TextureSwatchField
            onPickTexture={onPickTexture}
            onUploadTexture={onUploadTexture}
            texture={texture}
            uploading={uploading}
          />
        ) : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button disabled={saving} onClick={onCancel} size="small">
            Скасувати
          </Button>
          <Button disabled={!canSave} size="small" type="submit" variant="contained">
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
