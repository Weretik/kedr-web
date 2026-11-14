import { attributeKindLabel } from '@admin/catalog-attributes/model';
import { StatusPill } from '@admin/shared/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Button, Stack, Typography } from '@mui/material';

import type { CatalogAttribute } from '@admin/catalog-attributes/model';

interface AttributeOverviewHeaderProps {
  attribute: CatalogAttribute;
  canEdit: boolean;
  /** Codes from 1C names that no value decodes. */
  undecodedCount: number;
  onEdit: () => void;
}

const count = (value: number) => value.toLocaleString('uk-UA');

/** Name, code, kind, counts, problems, and the edit button of the chosen attribute. */
export function AttributeOverviewHeader({
  attribute,
  canEdit,
  onEdit,
  undecodedCount,
}: AttributeOverviewHeaderProps) {
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 1.5,
        justifyContent: 'space-between',
      }}
      useFlexGap
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h2" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }} variant="h5">
          {attribute.nameUk}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          <Box component="span" sx={{ fontFamily: 'monospace' }}>
            {attribute.code}
          </Box>{' '}
          · {attributeKindLabel(attribute.kind)} · {count(attribute.valueCount)} значень ·{' '}
          {count(attribute.productCount)} товарів
        </Typography>
      </Box>
      <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }} useFlexGap>
        {attribute.productCount === 0 ? <StatusPill label="Без товарів" tone="warning" /> : null}
        {undecodedCount > 0 ? (
          <StatusPill label={`Не розшифровано кодів: ${undecodedCount}`} tone="error" />
        ) : null}
        <Button
          aria-label={`${canEdit ? 'Редагувати' : 'Переглянути'} властивість ${attribute.nameUk}`}
          onClick={onEdit}
          startIcon={<EditOutlinedIcon />}
          variant="outlined"
        >
          {canEdit ? 'Редагувати' : 'Докладніше'}
        </Button>
      </Stack>
    </Stack>
  );
}
