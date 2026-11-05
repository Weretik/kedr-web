import { RowEditAction, SectionCard, StatusPill } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import { Button, Stack, Typography } from '@mui/material';

import { AttributeSwatch } from '../swatch/attribute-swatch';

import type { CatalogAttributeValue } from '@admin/catalog-attributes/model';

interface AttributeValuesCardProps {
  values: readonly CatalogAttributeValue[];
  canEdit: boolean;
  onAdd: () => void;
  onEdit: (value: CatalogAttributeValue) => void;
}

/** Values of a list attribute with their swatch and how many products have them. */
export function AttributeValuesCard({ canEdit, onAdd, onEdit, values }: AttributeValuesCardProps) {
  return (
    <SectionCard
      action={
        canEdit ? (
          <Button onClick={onAdd} size="small" startIcon={<AddIcon />}>
            Додати
          </Button>
        ) : undefined
      }
      title={`Значення (${values.length})`}
    >
      {values.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Значень немає.
        </Typography>
      ) : (
        <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {values.map((value) => (
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
              {value.isEditedManually ? <StatusPill label="Змінено вручну" tone="neutral" /> : null}
              {canEdit ? (
                <RowEditAction
                  label={`Редагувати значення ${value.nameUk}`}
                  onEdit={() => onEdit(value)}
                  title="Редагувати значення"
                />
              ) : null}
            </Stack>
          ))}
        </Stack>
      )}
    </SectionCard>
  );
}
