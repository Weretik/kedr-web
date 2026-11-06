import { FormControlLabel, MenuItem, Stack, Switch, TextField } from '@mui/material';

import type { NewCatalogAttribute } from '@admin/catalog-attributes/model';

/** What the form holds: numbers stay text while typing. */
export interface NewAttributeDraft {
  nameUk: string;
  nameRu: string;
  kind: NewCatalogAttribute['kind'];
  unit: string;
  isFilterable: boolean;
  isVariantAxis: boolean;
  sortOrder: string;
}

export const emptyNewAttribute: NewAttributeDraft = {
  nameUk: '',
  nameRu: '',
  kind: 'enum',
  unit: '',
  isFilterable: true,
  isVariantAxis: false,
  sortOrder: '100',
};

/** The new attribute, or `null` while the draft is not valid. */
export function toNewAttribute(draft: NewAttributeDraft): NewCatalogAttribute | null {
  const order = Number(draft.sortOrder);
  const name = draft.nameUk.trim();
  if (name === '' || name.length > 120) return null;
  if (draft.sortOrder.trim() === '' || !Number.isInteger(order) || order < 0) return null;
  if (draft.unit.trim().length > 16) return null;
  return {
    nameUk: name,
    nameRu: draft.nameRu.trim() || null,
    kind: draft.kind,
    unit: draft.kind === 'number' ? draft.unit.trim() || null : null,
    isFilterable: draft.isFilterable,
    isVariantAxis: draft.isVariantAxis,
    sortOrder: order,
  };
}

interface NewAttributeFieldsProps {
  draft: NewAttributeDraft;
  /** Show the errors after a submit attempt. */
  touched: boolean;
  onChange: (draft: NewAttributeDraft) => void;
}

/** Fields of «Нова ознака»: names, list, «Так / Ні» or number, unit, site filter, model switcher, order. */
export function NewAttributeFields({ draft, onChange, touched }: NewAttributeFieldsProps) {
  const set = (patch: Partial<NewAttributeDraft>) => onChange({ ...draft, ...patch });
  const name = draft.nameUk.trim();
  const nameInvalid = touched && (name === '' || name.length > 120);
  const order = Number(draft.sortOrder);
  const orderInvalid =
    touched && (draft.sortOrder.trim() === '' || !Number.isInteger(order) || order < 0);

  return (
    <Stack spacing={2}>
      <TextField
        error={nameInvalid}
        helperText={nameInvalid ? 'Вкажіть назву до 120 символів.' : 'Наприклад, «Матеріал ручки»'}
        label="Назва українською"
        onChange={(event) => set({ nameUk: event.target.value })}
        required
        value={draft.nameUk}
      />
      <TextField
        label="Назва російською"
        onChange={(event) => set({ nameRu: event.target.value })}
        value={draft.nameRu}
      />
      <TextField
        helperText={
          draft.kind === 'enum'
            ? 'Значення ви додасте в панелі ознаки після створення.'
            : draft.kind === 'yesno'
              ? 'Значення «Так» і «Ні» з’являться одразу.'
              : 'Число, наприклад довжина в мм.'
        }
        label="Тип"
        onChange={(event) => set({ kind: event.target.value as NewAttributeDraft['kind'] })}
        select
        value={draft.kind}
      >
        <MenuItem value="enum">Список значень</MenuItem>
        <MenuItem value="yesno">Так / Ні</MenuItem>
        <MenuItem value="number">Число</MenuItem>
      </TextField>
      {draft.kind === 'number' ? (
        <TextField
          helperText="Наприклад, мм"
          label="Одиниця"
          onChange={(event) => set({ unit: event.target.value })}
          slotProps={{ htmlInput: { maxLength: 16 } }}
          value={draft.unit}
        />
      ) : null}
      <TextField
        error={orderInvalid}
        helperText={orderInvalid ? 'Ціле число від 0.' : 'Менше число — вище у фільтрах'}
        label="Порядок"
        onChange={(event) => set({ sortOrder: event.target.value })}
        slotProps={{ htmlInput: { inputMode: 'numeric' } }}
        value={draft.sortOrder}
      />
      <FormControlLabel
        control={
          <Switch
            checked={draft.isFilterable}
            onChange={(_event, checked) => set({ isFilterable: checked })}
          />
        }
        label="Показувати як фільтр на сайті"
      />
      <FormControlLabel
        control={
          <Switch
            checked={draft.isVariantAxis}
            onChange={(_event, checked) => set({ isVariantAxis: checked })}
          />
        }
        label="Товари моделі можуть відрізнятися цією ознакою (перемикач на сторінці моделі)"
      />
    </Stack>
  );
}
