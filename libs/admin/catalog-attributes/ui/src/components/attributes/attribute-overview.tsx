import { DetailField, DetailFieldList } from '@admin/shared/ui';
import { Box, Stack, Typography } from '@mui/material';

import { AttributeOverviewHeader } from './attribute-overview-header';
import { AttributeValuesSection } from './attribute-values-section';

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
  const undecoded = aliases.filter((alias) => alias.valueId === null);
  const yesNo = (flag: boolean) => (flag ? 'так' : 'ні');

  return (
    <Stack spacing={2.5} sx={{ minWidth: 0 }}>
      <AttributeOverviewHeader
        attribute={attribute}
        canEdit={canEdit}
        onEdit={onEdit}
        undecodedCount={undecoded.length}
      />

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
        <AttributeValuesSection
          aliases={aliases}
          canEdit={canEdit}
          onEditValue={onEditValue}
          values={values}
        />
      ) : null}
    </Stack>
  );
}
