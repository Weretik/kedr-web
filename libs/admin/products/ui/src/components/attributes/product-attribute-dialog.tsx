import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';

import type {
  AttributeOption,
  AttributeValueOption,
  ProductAttribute,
  ProductAttributeInput,
} from '@admin/products/model';

interface ProductAttributeDialogProps {
  /** The attribute being changed; empty when a person adds one. */
  attribute: ProductAttribute | null;
  /** Attributes to choose from when adding. */
  attributeOptions: readonly AttributeOption[];
  /** Values of the chosen list attribute. */
  valueOptions: readonly AttributeValueOption[];
  valuesLoading: boolean;
  saving: boolean;
  error: string | null;
  onAttributeChange: (attributeId: number | null) => void;
  onCancel: () => void;
  onSave: (attributeId: number, input: ProductAttributeInput) => void;
}

/** Sets the values of one attribute by hand; several values keep their order (main color first). */
export function ProductAttributeDialog({
  attribute,
  attributeOptions,
  error,
  onAttributeChange,
  onCancel,
  onSave,
  saving,
  valueOptions,
  valuesLoading,
}: ProductAttributeDialogProps) {
  const [chosen, setChosen] = useState<AttributeOption | null>(null);
  const [values, setValues] = useState<AttributeValueOption[]>(() =>
    (attribute?.values ?? [])
      .filter((value) => value.valueId !== null)
      .map((value) => ({ id: value.valueId as number, name: value.valueName ?? '' })),
  );
  const [numbers, setNumbers] = useState(() =>
    (attribute?.values ?? []).map((value) => value.number ?? '').join('; '),
  );

  const attributeId = attribute?.attributeId ?? chosen?.id ?? null;
  const kind = attribute?.kind ?? chosen?.kind ?? 'enum';
  const parsedNumbers = numbers
    .split(';')
    .map((part) => part.trim().replace(',', '.'))
    .filter(Boolean)
    .map(Number);
  const numbersValid = parsedNumbers.length > 0 && parsedNumbers.every(Number.isFinite);
  const canSave =
    attributeId !== null && !saving && (kind === 'number' ? numbersValid : values.length > 0);

  return (
    <Dialog fullWidth maxWidth="sm" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>{attribute ? attribute.name : 'Додати властивість'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {attribute ? null : (
            <Autocomplete
              getOptionLabel={(option) => option.name}
              onChange={(_event, option) => {
                setChosen(option);
                setValues([]);
                onAttributeChange(option?.id ?? null);
              }}
              options={attributeOptions}
              renderInput={(params) => <TextField {...params} label="Властивість" />}
              value={chosen}
            />
          )}
          {attributeId === null ? null : kind === 'number' ? (
            <TextField
              error={numbers.trim() !== '' && !numbersValid}
              helperText="Кілька чисел — через крапку з комою"
              label={`Значення${(attribute?.unit ?? chosen?.unit) ? `, ${attribute?.unit ?? chosen?.unit}` : ''}`}
              onChange={(event) => setNumbers(event.target.value)}
              value={numbers}
            />
          ) : (
            <Autocomplete
              filterSelectedOptions
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              loading={valuesLoading}
              multiple
              onChange={(_event, next) => setValues(next)}
              options={valueOptions}
              renderInput={(params) => (
                <TextField {...params} helperText="Перше значення — основне" label="Значення" />
              )}
              value={values}
            />
          )}
          <Alert severity="info">
            Значення стане ручним: імпорт і розпізнавання його не змінюватимуть.
          </Alert>
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
            attributeId !== null &&
            onSave(
              attributeId,
              kind === 'number'
                ? { numbers: parsedNumbers }
                : { valueIds: values.map((value) => value.id) },
            )
          }
          variant="contained"
        >
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
