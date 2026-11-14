import { RowEditAction, StatusPill } from '@admin/shared/ui';
import {
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { AttributeSwatch } from '../components/swatch/attribute-swatch';

import type { CatalogAttributeAlias, CatalogAttributeValue } from '@admin/catalog-attributes/model';

interface AttributeValuesTableProps {
  values: readonly CatalogAttributeValue[];
  aliases: readonly CatalogAttributeAlias[];
  canEdit: boolean;
  onEditValue: (value: CatalogAttributeValue) => void;
}

const count = (value: number) => value.toLocaleString('uk-UA');

/** Values with their swatch, code, 1C spellings, and product count. */
export function AttributeValuesTable({
  aliases,
  canEdit,
  onEditValue,
  values,
}: AttributeValuesTableProps) {
  const spellings = (value: CatalogAttributeValue) =>
    aliases.filter((alias) => alias.valueId === value.id);

  return (
    <TableContainer sx={{ overflowX: 'auto' }}>
      <Table size="small" sx={{ minWidth: 560 }}>
        <TableHead>
          <TableRow>
            <TableCell>Значення</TableCell>
            <TableCell>Код</TableCell>
            <TableCell>Як пишуть в 1С</TableCell>
            <TableCell align="right">Товарів</TableCell>
            {canEdit ? <TableCell align="right">Дії</TableCell> : null}
          </TableRow>
        </TableHead>
        <TableBody>
          {values.map((value) => (
            <TableRow key={value.id}>
              <TableCell>
                <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                  <AttributeSwatch
                    hex={value.swatchHex}
                    imageUrl={value.swatchImageUrl}
                    label={value.nameUk}
                    size={20}
                  />
                  <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }} variant="body2">
                    {value.nameUk}
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell sx={{ fontFamily: 'monospace' }}>{value.code}</TableCell>
              <TableCell>
                <Stack
                  direction="row"
                  sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 0.75 }}
                  useFlexGap
                >
                  {spellings(value).map((alias) => (
                    <Box component="span" key={alias.id} sx={{ fontFamily: 'monospace' }}>
                      {alias.rawValue}
                    </Box>
                  ))}
                  {spellings(value).some((alias) => !alias.isConfirmed) ? (
                    <StatusPill label="Не підтверджено" tone="warning" />
                  ) : null}
                </Stack>
              </TableCell>
              <TableCell align="right" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {count(value.productCount)}
              </TableCell>
              {canEdit ? (
                <TableCell align="right">
                  <RowEditAction
                    label={`Редагувати значення ${value.nameUk}`}
                    onEdit={() => onEditValue(value)}
                    title="Редагувати значення"
                  />
                </TableCell>
              ) : null}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
