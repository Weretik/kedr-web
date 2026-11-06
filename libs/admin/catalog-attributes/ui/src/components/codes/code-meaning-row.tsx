import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Button, IconButton, MenuItem, Select, Stack, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';

import type {
  CatalogAttribute,
  CatalogAttributeValue,
  MeaningDraft,
} from '@admin/catalog-attributes/model';

const newValue = 'new';

export interface CodeMeaningRowProps {
  /** Where the row is, for screen readers: «для всіх товарів» or a category. */
  label: string;
  row: MeaningDraft;
  /** Attributes a code can mean: lists of values. */
  attributes: readonly CatalogAttribute[];
  /** Attributes taken by the other rows. */
  usedAttributeIds: readonly number[];
  values: readonly CatalogAttributeValue[];
  valuesLoading: boolean;
  canRemove: boolean;
  creating: boolean;
  onChange: (row: MeaningDraft) => void;
  onRemove: () => void;
  /** Adds a value to the row's attribute and returns its id. */
  onCreateValue: (nameUk: string) => Promise<number | undefined>;
}

/**
 * One meaning of a code (spec catalog/009): an attribute, then its value; a missing value can be added right here.
 */
export function CodeMeaningRow(props: CodeMeaningRowProps) {
  const { row } = props;
  const [draft, setDraft] = useState<string | null>(null);
  const attributes = props.attributes.filter(
    (attribute) =>
      attribute.id === row.attributeId || !props.usedAttributeIds.includes(attribute.id),
  );

  const add = async () => {
    const name = draft?.trim();
    if (!name) return;
    const id = await props.onCreateValue(name);
    if (id !== undefined) {
      props.onChange({ ...row, valueId: id });
      setDraft(null);
    }
  };

  return (
    <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }} useFlexGap>
      <Select
        aria-label={`Ознака ${props.label}`}
        displayEmpty
        onChange={(event) => {
          setDraft(null);
          props.onChange({ attributeId: Number(event.target.value) || null, valueId: null });
        }}
        size="small"
        sx={{ flex: '1 1 220px', maxWidth: 320 }}
        value={row.attributeId === null ? '' : String(row.attributeId)}
      >
        <MenuItem value="">— ознака —</MenuItem>
        {attributes.map((attribute) => (
          <MenuItem key={attribute.id} value={String(attribute.id)}>
            {attribute.nameUk}
          </MenuItem>
        ))}
      </Select>
      {draft === null ? (
        <Select
          aria-label={`Значення ${props.label}`}
          disabled={row.attributeId === null || props.valuesLoading}
          displayEmpty
          onChange={(event) => {
            if (event.target.value === newValue) setDraft('');
            else props.onChange({ ...row, valueId: Number(event.target.value) || null });
          }}
          size="small"
          sx={{ flex: '1 1 220px', maxWidth: 320 }}
          value={row.valueId === null ? '' : String(row.valueId)}
        >
          <MenuItem value="">— значення —</MenuItem>
          {props.values.map((value) => (
            <MenuItem key={value.id} value={String(value.id)}>
              {value.nameUk} ({value.code})
            </MenuItem>
          ))}
          <MenuItem sx={{ color: 'primary.main' }} value={newValue}>
            + Нове значення…
          </MenuItem>
        </Select>
      ) : (
        <Stack direction="row" sx={{ alignItems: 'center', flex: '1 1 220px', gap: 1 }} useFlexGap>
          <TextField
            autoFocus
            label="Нове значення"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') void add();
            }}
            size="small"
            sx={{ flex: 1, minWidth: 160 }}
            value={draft}
          />
          <Button
            disabled={!draft.trim() || props.creating}
            onClick={() => void add()}
            variant="outlined"
          >
            {props.creating ? 'Додавання…' : 'Додати'}
          </Button>
          <Button onClick={() => setDraft(null)}>Скасувати</Button>
        </Stack>
      )}
      {props.canRemove ? (
        <Tooltip title="Прибрати ознаку">
          <IconButton
            aria-label={`Прибрати ознаку ${props.label}`}
            onClick={props.onRemove}
            size="small"
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Stack>
  );
}
