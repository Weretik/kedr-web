import { attributeKindLabel } from '@admin/catalog-attributes/model';
import { DetailField, DetailFieldList, SectionCard } from '@admin/shared/ui';
import { Alert, Button, FormControlLabel, Stack, Switch, TextField } from '@mui/material';
import { useState } from 'react';

import type { CatalogAttribute, CatalogAttributeChange } from '@admin/catalog-attributes/model';

interface AttributeSettingsCardProps {
  attribute: CatalogAttribute;
  canEdit: boolean;
  saving: boolean;
  error: string | null;
  onSave: (change: CatalogAttributeChange) => void;
}

/** The attribute name and site filter setting; a person's change is kept from the dictionary import. */
export function AttributeSettingsCard({
  attribute,
  canEdit,
  error,
  onSave,
  saving,
}: AttributeSettingsCardProps) {
  const [nameUk, setNameUk] = useState(attribute.nameUk);
  const [nameRu, setNameRu] = useState(attribute.nameRu ?? '');
  const [isFilterable, setIsFilterable] = useState(attribute.isFilterable);
  const [sortOrder, setSortOrder] = useState(String(attribute.sortOrder));
  const order = Number(sortOrder);
  const orderValid = sortOrder.trim() !== '' && Number.isInteger(order) && order >= 0;
  const nameValid = nameUk.trim() !== '' && nameUk.trim().length <= 128;

  return (
    <SectionCard title="Властивість">
      <DetailFieldList columns={2}>
        <DetailField label="Код" value={attribute.code} />
        <DetailField label="Тип" value={attributeKindLabel(attribute.kind)} />
        <DetailField label="Адреса у фільтрі" value={attribute.slug} />
        {attribute.unit ? <DetailField label="Одиниця" value={attribute.unit} /> : null}
      </DetailFieldList>
      {canEdit ? (
        <Stack
          component="form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            if (nameValid && orderValid)
              onSave({ nameUk, nameRu: nameRu || null, isFilterable, sortOrder: order });
          }}
          spacing={2}
        >
          <TextField
            error={!nameValid}
            helperText={nameValid ? undefined : 'Вкажіть назву до 128 символів.'}
            label="Назва українською"
            onChange={(event) => setNameUk(event.target.value)}
            required
            value={nameUk}
          />
          <TextField
            label="Назва російською"
            onChange={(event) => setNameRu(event.target.value)}
            value={nameRu}
          />
          <TextField
            error={!orderValid}
            helperText={orderValid ? 'Менше число — вище у фільтрах' : 'Ціле число від 0.'}
            label="Порядок"
            onChange={(event) => setSortOrder(event.target.value)}
            slotProps={{ htmlInput: { inputMode: 'numeric' } }}
            value={sortOrder}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isFilterable}
                onChange={(_event, checked) => setIsFilterable(checked)}
              />
            }
            label="Показувати як фільтр на сайті"
          />
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
            <Button
              disabled={saving || !nameValid || !orderValid}
              type="submit"
              variant="contained"
            >
              {saving ? 'Збереження…' : 'Зберегти'}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <DetailFieldList columns={2}>
          <DetailField label="Назва українською" value={attribute.nameUk} />
          <DetailField label="Назва російською" value={attribute.nameRu ?? '—'} />
          <DetailField label="Порядок" value={attribute.sortOrder} />
          <DetailField label="Фільтр на сайті" value={attribute.isFilterable ? 'Так' : 'Ні'} />
        </DetailFieldList>
      )}
    </SectionCard>
  );
}
