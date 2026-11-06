import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { Button, Stack } from '@mui/material';

import type { MeaningDraft } from '@admin/catalog-attributes/model';
import type { ComponentType } from 'react';

/** What a meaning row gets from the editor; the feature connects it to the attribute values. */
export interface MeaningRowSlotProps {
  label: string;
  row: MeaningDraft;
  usedAttributeIds: readonly number[];
  canRemove: boolean;
  onChange: (row: MeaningDraft) => void;
  onRemove: () => void;
}

interface CodeMeaningsEditorProps {
  label: string;
  rows: readonly MeaningDraft[];
  Row: ComponentType<MeaningRowSlotProps>;
  onChange: (rows: MeaningDraft[]) => void;
}

/** The «ознака → значення» rows of a decoding (spec catalog/009) with «+ Ще ознака». */
export function CodeMeaningsEditor({ label, rows, Row, onChange }: CodeMeaningsEditorProps) {
  const used = rows.map((row) => row.attributeId).filter((id): id is number => id !== null);
  return (
    <Stack spacing={1} sx={{ minWidth: 0 }}>
      {rows.map((row, index) => (
        <Row
          canRemove={rows.length > 1}
          // Rows have no id of their own; their order is stable while the screen is open.
          key={index}
          label={`${index + 1} ${label}`}
          onChange={(next) => onChange(rows.map((item, at) => (at === index ? next : item)))}
          onRemove={() => onChange(rows.filter((_, at) => at !== index))}
          row={row}
          usedAttributeIds={used.filter((id) => id !== row.attributeId)}
        />
      ))}
      <Button
        onClick={() => onChange([...rows, { attributeId: null, valueId: null }])}
        size="small"
        startIcon={<AddRoundedIcon />}
        sx={{ alignSelf: 'flex-start' }}
      >
        Ще ознака
      </Button>
    </Stack>
  );
}
