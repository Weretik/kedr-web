import { isSwatchHex } from '@admin/catalog-attributes/model';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { AttributeSwatch } from '../swatch/attribute-swatch';

import type {
  CatalogAttributeValue,
  CatalogAttributeValueChange,
} from '@admin/catalog-attributes/model';

type SwatchKind = 'none' | 'color' | 'texture';

/** A decor picture chosen from «Медіа». */
export interface SwatchTexture {
  id: number;
  url: string | null;
}

interface AttributeValueDialogProps {
  /** The value being changed; empty when a person adds one. */
  value: CatalogAttributeValue | null;
  /** The texture picked in the library, owned by the page so the picker can set it. */
  texture: SwatchTexture | null;
  saving: boolean;
  error: string | null;
  onPickTexture: () => void;
  onCancel: () => void;
  onSave: (change: CatalogAttributeValueChange) => void;
}

function initialKind(value: CatalogAttributeValue | null): SwatchKind {
  if (value?.swatchMediaFileId) return 'texture';
  if (value?.swatchHex) return 'color';
  return 'none';
}

/** Name, order, and swatch of one value: a color, a decor texture, or only text. */
export function AttributeValueDialog({
  error,
  onCancel,
  onPickTexture,
  onSave,
  saving,
  texture,
  value,
}: AttributeValueDialogProps) {
  const [nameUk, setNameUk] = useState(value?.nameUk ?? '');
  const [nameRu, setNameRu] = useState(value?.nameRu ?? '');
  const [sortOrder, setSortOrder] = useState(String(value?.sortOrder ?? 0));
  const [kind, setKind] = useState<SwatchKind>(initialKind(value));
  const [hex, setHex] = useState(value?.swatchHex ?? '');

  const order = Number(sortOrder);
  const orderValid = sortOrder.trim() !== '' && Number.isInteger(order) && order >= 0;
  const nameValid = nameUk.trim() !== '' && nameUk.trim().length <= 128;
  const hexValid = kind !== 'color' || (hex !== '' && isSwatchHex(hex));
  const textureValid = kind !== 'texture' || texture !== null;
  const canSave = !saving && nameValid && orderValid && hexValid && textureValid;

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>{value ? value.nameUk : 'Нове значення'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextField
            error={!nameValid && nameUk !== ''}
            label="Назва українською"
            onChange={(event) => setNameUk(event.target.value)}
            required
            value={nameUk}
          />
          <TextField
            label="Назва російською"
            onChange={(event) => setNameRu(event.target.value)}
            value={nameRu}
          />
          <TextField
            error={!orderValid}
            helperText={orderValid ? 'Менше число — вище у списку' : 'Ціле число від 0.'}
            label="Порядок"
            onChange={(event) => setSortOrder(event.target.value)}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            value={sortOrder}
          />
          <Box>
            <Typography component="p" sx={{ fontWeight: 600, mb: 0.5 }} variant="body2">
              Зразок у фільтрі
            </Typography>
            <RadioGroup onChange={(_event, next) => setKind(next as SwatchKind)} row value={kind}>
              <FormControlLabel control={<Radio />} label="Лише текст" value="none" />
              <FormControlLabel control={<Radio />} label="Колір" value="color" />
              <FormControlLabel control={<Radio />} label="Текстура" value="texture" />
            </RadioGroup>
          </Box>
          {kind === 'color' ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <Box
                aria-label="Вибрати колір"
                component="input"
                onChange={(event) => setHex(event.target.value.toUpperCase())}
                sx={{ border: 0, height: 44, p: 0, width: 56, bgcolor: 'transparent' }}
                type="color"
                value={isSwatchHex(hex) && hex !== '' ? hex : '#000000'}
              />
              <TextField
                error={!hexValid}
                helperText={hexValid ? undefined : 'Формат #RRGGBB, наприклад #B08D57.'}
                label="Колір"
                onChange={(event) => setHex(event.target.value.trim())}
                value={hex}
              />
            </Stack>
          ) : null}
          {kind === 'texture' ? (
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              {texture ? (
                <AttributeSwatch hex={null} imageUrl={texture.url} label="Текстура" size={44} />
              ) : (
                <Typography color="error" variant="body2">
                  Текстуру не вибрано.
                </Typography>
              )}
              <Button onClick={onPickTexture} variant="outlined">
                {texture ? 'Змінити' : 'Вибрати з медіатеки'}
              </Button>
            </Stack>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onCancel}>
          Скасувати
        </Button>
        <Button
          disabled={!canSave}
          onClick={() =>
            onSave({
              nameUk,
              nameRu: nameRu || null,
              sortOrder: order,
              swatchHex: kind === 'color' ? hex : null,
              swatchMediaFileId: kind === 'texture' ? (texture?.id ?? null) : null,
            })
          }
          variant="contained"
        >
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
