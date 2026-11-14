import { searchAttributeValues } from '@admin/catalog-attributes/model';
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { AttributeValuesTable } from '../../tables/attribute-values-table';

import type { CatalogAttributeAlias, CatalogAttributeValue } from '@admin/catalog-attributes/model';

interface AttributeValuesSectionProps {
  values: readonly CatalogAttributeValue[];
  aliases: readonly CatalogAttributeAlias[];
  canEdit: boolean;
  /** Opens a value (or a new one with `null`) in the edit panel. */
  onEditValue: (value: CatalogAttributeValue | null) => void;
}

/** A search box appears once the list is longer than this. */
const searchFrom = 8;

/** «Значення» of a list attribute: search, add, and the values table. */
export function AttributeValuesSection({
  aliases,
  canEdit,
  onEditValue,
  values,
}: AttributeValuesSectionProps) {
  const [search, setSearch] = useState('');
  const shown = searchAttributeValues(values, search);

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
        useFlexGap
      >
        <Typography component="h3" sx={{ fontWeight: 700 }} variant="subtitle1">
          Значення ({values.length})
        </Typography>
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }} useFlexGap>
          {values.length > searchFrom ? (
            <TextField
              aria-label="Знайти значення"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Знайти значення"
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
              type="search"
              value={search}
            />
          ) : null}
          {canEdit ? (
            <Button onClick={() => onEditValue(null)} size="small" startIcon={<AddIcon />}>
              Значення
            </Button>
          ) : null}
        </Stack>
      </Stack>
      {values.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Значень немає.
        </Typography>
      ) : (
        <AttributeValuesTable
          aliases={aliases}
          canEdit={canEdit}
          onEditValue={onEditValue}
          values={shown}
        />
      )}
    </Stack>
  );
}
