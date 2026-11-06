import { RowEditAction, SectionCard, StatusPill } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import { AttributeSwatch } from '../swatch/attribute-swatch';

import type { CatalogAttributeValue } from '@admin/catalog-attributes/model';
import type { ReactNode } from 'react';

interface AttributeValuesCardProps {
  values: readonly CatalogAttributeValue[];
  canEdit: boolean;
  /** The value edited in place: its id, `'new'` while adding one, or nothing. */
  editing: number | 'new' | undefined;
  /** The form shown in place of the edited value (or on top for a new one). */
  form: ReactNode;
  onAdd: () => void;
  onEdit: (value: CatalogAttributeValue) => void;
}

/** A search box appears once the list is longer than this. */
const searchFrom = 8;

/**
 * Values of a list attribute with their swatch and how many products have them. A value is changed right in the list,
 * without a separate window.
 */
export function AttributeValuesCard(props: AttributeValuesCardProps) {
  const { canEdit, editing, values } = props;
  const [search, setSearch] = useState('');
  const term = search.trim().toLocaleLowerCase('uk');
  const shown = term
    ? values.filter(
        (value) =>
          value.id === editing ||
          value.nameUk.toLocaleLowerCase('uk').includes(term) ||
          value.code.toLocaleLowerCase('uk').includes(term),
      )
    : values;

  return (
    <SectionCard
      action={
        canEdit ? (
          <Button
            disabled={editing === 'new'}
            onClick={props.onAdd}
            size="small"
            startIcon={<AddIcon />}
          >
            Додати
          </Button>
        ) : undefined
      }
      title={`Значення (${values.length})`}
    >
      <Stack spacing={1.5}>
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
        {editing === 'new' ? props.form : null}
        {values.length === 0 && editing !== 'new' ? (
          <Typography color="text.secondary" variant="body2">
            Значень немає.
          </Typography>
        ) : (
          <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {shown.map((value) =>
              value.id === editing ? (
                <li key={value.id}>{props.form}</li>
              ) : (
                <Stack
                  component="li"
                  direction="row"
                  key={value.id}
                  spacing={1.5}
                  sx={{ alignItems: 'center', minWidth: 0 }}
                >
                  <AttributeSwatch
                    hex={value.swatchHex}
                    imageUrl={value.swatchImageUrl}
                    label={value.nameUk}
                  />
                  <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
                      {value.nameUk}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {value.code} · товарів: {value.productCount}
                    </Typography>
                  </Stack>
                  {value.isEditedManually ? (
                    <StatusPill label="Змінено вручну" tone="neutral" />
                  ) : null}
                  {canEdit ? (
                    <RowEditAction
                      label={`Редагувати значення ${value.nameUk}`}
                      onEdit={() => props.onEdit(value)}
                      title="Редагувати значення"
                    />
                  ) : null}
                </Stack>
              ),
            )}
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
}
