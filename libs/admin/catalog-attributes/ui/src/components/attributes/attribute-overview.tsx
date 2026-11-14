import { attributeKindLabel } from '@admin/catalog-attributes/model';
import { DetailField, DetailFieldList, RowEditAction, StatusPill } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Box,
  Button,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { AttributeSwatch } from '../swatch/attribute-swatch';

import type {
  CatalogAttributeDetails,
  CatalogAttributeValue,
} from '@admin/catalog-attributes/model';

interface AttributeOverviewProps {
  details: CatalogAttributeDetails;
  canEdit: boolean;
  /** Opens the attribute in the right-side edit panel. */
  onEdit: () => void;
  /** Opens a value (or a new one with `null`) in the edit panel. */
  onEditValue: (value: CatalogAttributeValue | null) => void;
}

/** A search box appears once the list is longer than this. */
const searchFrom = 8;

const count = (value: number) => value.toLocaleString('uk-UA');

/**
 * The chosen attribute of «Ознаки», read-only: its settings, every value with its swatch, products, and how 1C writes
 * it, and the codes nobody decoded. Changes open the right-side panel.
 */
export function AttributeOverview({
  canEdit,
  details,
  onEdit,
  onEditValue,
}: AttributeOverviewProps) {
  const { aliases, attribute, values } = details;
  const [search, setSearch] = useState('');
  const term = search.trim().toLocaleLowerCase('uk');
  const shown = term
    ? values.filter(
        (value) =>
          value.nameUk.toLocaleLowerCase('uk').includes(term) ||
          value.code.toLocaleLowerCase('uk').includes(term),
      )
    : values;
  const spellings = (value: CatalogAttributeValue) =>
    aliases.filter((alias) => alias.valueId === value.id);
  const undecoded = aliases.filter((alias) => alias.valueId === null);
  const yesNo = (flag: boolean) => (flag ? 'так' : 'ні');

  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
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
          <Typography
            component="h2"
            sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}
            variant="h5"
          >
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
          {undecoded.length > 0 ? (
            <StatusPill label={`Не розшифровано кодів: ${undecoded.length}`} tone="error" />
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

      <Box sx={{ bgcolor: 'background.default', borderRadius: 3, p: 1.5 }}>
        <DetailFieldList columns={2}>
          <DetailField label="Фільтр на сайті" value={yesNo(attribute.isFilterable)} />
          <DetailField label="Перемикач моделі" value={yesNo(attribute.isVariantAxis)} />
          <DetailField label="Порядок" value={attribute.sortOrder} />
          <DetailField label="Назва російською" value={attribute.nameRu ?? '—'} />
          <DetailField label="Адреса у фільтрі" value={attribute.slug} />
          {attribute.unit ? <DetailField label="Одиниця" value={attribute.unit} /> : null}
        </DetailFieldList>
      </Box>

      {undecoded.length > 0 ? (
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }} useFlexGap>
          <Typography variant="body2">Коди з назв 1С без значення:</Typography>
          {undecoded.map((alias) => (
            <Box
              component="span"
              key={alias.id}
              sx={{
                border: 1,
                borderColor: 'error.main',
                borderRadius: 1.5,
                color: 'error.main',
                fontFamily: 'monospace',
                fontWeight: 700,
                px: 0.75,
              }}
            >
              {alias.rawValue}
            </Box>
          ))}
          <Typography color="text.secondary" variant="caption">
            Розшифруйте їх у вкладці «Не розшифровані коди».
          </Typography>
        </Stack>
      ) : null}

      {attribute.kind === 'enum' ? (
        <Stack spacing={1.5}>
          <Stack
            direction="row"
            sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}
            useFlexGap
          >
            <Typography component="h3" sx={{ fontWeight: 700 }} variant="subtitle1">
              Значення ({values.length})
            </Typography>
            <Stack
              direction="row"
              sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}
              useFlexGap
            >
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
                  {shown.map((value) => (
                    <TableRow key={value.id}>
                      <TableCell>
                        <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
                          <AttributeSwatch
                            hex={value.swatchHex}
                            imageUrl={value.swatchImageUrl}
                            label={value.nameUk}
                            size={20}
                          />
                          <Typography
                            sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}
                            variant="body2"
                          >
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
          )}
        </Stack>
      ) : null}
    </Stack>
  );
}
