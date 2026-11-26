import { Autocomplete, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { LoneModelCandidate } from '@admin/site-models/model';

interface LoneProductModelPickerProps {
  models: readonly LoneModelCandidate[];
  /** A similar model by name in the same category, picked until the person picks another. */
  suggestedId?: number;
  loading: boolean;
  /** A save runs: «Додати» is locked. */
  pending: boolean;
  onAdd: (modelId: number) => void;
}

/** «Додати в модель» in a row of «Товари без моделі»: a model picker and «Додати» (spec 001 R-008). */
export function LoneProductModelPicker(props: LoneProductModelPickerProps) {
  const { loading, models, onAdd, pending, suggestedId } = props;
  // `undefined` until the person picks: the suggestion stays in the field.
  const [picked, setPicked] = useState<number | null | undefined>(undefined);
  const selectedId = picked === undefined ? suggestedId : picked;
  const selected = models.find((model) => model.id === selectedId) ?? null;
  const suggested = picked === undefined && selected !== null;

  return (
    // The grid moves between cells on arrow keys and space; keep them in the picker.
    <Box onKeyDown={(event) => event.stopPropagation()} sx={{ py: 1, width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Autocomplete
          getOptionLabel={(model) => model.name}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          loading={loading}
          noOptionsText="У цій категорії немає моделей"
          onChange={(_event, model) => setPicked(model?.id ?? null)}
          options={models}
          renderInput={(params) => (
            <TextField {...params} label="Модель" placeholder="Виберіть модель" />
          )}
          renderOption={({ key, ...optionProps }, model) => (
            <Box component="li" key={key} {...optionProps}>
              <Stack>
                <span>{model.name}</span>
                {model.status === 'proposed' ? (
                  <Typography color="text.secondary" variant="caption">
                    Не перевірена
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          )}
          size="small"
          sx={{ flex: 1, minWidth: 180 }}
          value={selected}
        />
        <Button
          disabled={!selected || pending}
          onClick={() => selected && onAdd(selected.id)}
          variant="outlined"
        >
          Додати
        </Button>
      </Stack>
      {suggested ? (
        <Typography color="text.secondary" sx={{ display: 'block', mt: 0.5 }} variant="caption">
          Схожа модель за назвою — підставлено автоматично
        </Typography>
      ) : null}
    </Box>
  );
}
