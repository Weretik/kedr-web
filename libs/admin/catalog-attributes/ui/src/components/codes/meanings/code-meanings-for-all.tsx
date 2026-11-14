import { Checkbox, FormControlLabel, Stack, Typography } from '@mui/material';

import { CodeMeaningsEditor } from './code-meanings-editor';

import type { MeaningRowSlotProps } from './code-meanings-editor';
import type { MeaningsDraft } from '@admin/catalog-attributes/model';
import type { ComponentType } from 'react';

interface CodeMeaningsForAllProps {
  value: MeaningsDraft;
  MeaningRow: ComponentType<MeaningRowSlotProps>;
  onChange: (value: MeaningsDraft) => void;
}

/** What the code means for all products, or that it means nothing. */
export function CodeMeaningsForAll({ MeaningRow, onChange, value }: CodeMeaningsForAllProps) {
  return (
    <Stack
      component="section"
      aria-label="Розшифровка для всіх товарів"
      spacing={1}
      sx={{ bgcolor: 'background.default', borderRadius: 3, p: 1.5 }}
    >
      <Stack
        direction="row"
        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
        useFlexGap
      >
        <Typography sx={{ fontWeight: 700 }} variant="body2">
          Що означає код для всіх товарів
        </Typography>
        <Typography color="text.secondary" variant="caption">
          Оберіть ознаку, потім значення. Розшифровка категорії має пріоритет.
        </Typography>
      </Stack>
      {value.nothing ? null : (
        <CodeMeaningsEditor
          label="для всіх товарів"
          onChange={(rows) => onChange({ ...value, rows })}
          Row={MeaningRow}
          rows={value.rows}
        />
      )}
      <FormControlLabel
        control={
          <Checkbox
            checked={value.nothing}
            onChange={(event) => onChange({ ...value, nothing: event.target.checked })}
            size="small"
          />
        }
        label="Код нічого не означає (не фільтрувати)"
        slotProps={{ typography: { variant: 'body2' } }}
      />
    </Stack>
  );
}
