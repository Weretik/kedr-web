import { AdminEditPanel } from '@admin/shared/ui';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Alert,
  Button,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import { AttributeSwatch } from '../swatch/attribute-swatch';

import type { CatalogAttributeValue, UnresolvedCode } from '@admin/catalog-attributes/model';

/** The choice «Без значення»: the code means nothing to filter by. */
const noValue = 'none';

interface CodeDecisionPanelProps {
  /** The code being decided; the panel is closed without one. */
  code: UnresolvedCode | undefined;
  /** Values of the code's attribute. */
  values: readonly CatalogAttributeValue[];
  valuesLoading: boolean;
  saving: boolean;
  error: string | null;
  onClose: () => void;
  onSave: (valueId: number | null) => void;
}

function DecisionForm({
  code,
  error,
  onClose,
  onSave,
  saving,
  values,
  valuesLoading,
}: CodeDecisionPanelProps & { code: UnresolvedCode }) {
  const [choice, setChoice] = useState(code.valueId === null ? '' : String(code.valueId));
  const [search, setSearch] = useState('');
  const term = search.trim().toLocaleLowerCase('uk');
  const shown = term
    ? values.filter(
        (value) =>
          String(value.id) === choice ||
          value.nameUk.toLocaleLowerCase('uk').includes(term) ||
          value.code.toLocaleLowerCase('uk').includes(term),
      )
    : values;

  return (
    <Stack spacing={2.5}>
      <Typography color="text.secondary" variant="body2">
        Трапляється в {code.productCount} тов.{code.note ? ` · ${code.note}` : ''}
      </Typography>
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
      {valuesLoading ? (
        <Skeleton aria-label="Завантаження значень" height={160} variant="rounded" />
      ) : (
        <RadioGroup
          aria-label="Що означає код"
          onChange={(_event, next) => setChoice(next)}
          value={choice}
        >
          {shown.map((value) => (
            <FormControlLabel
              control={<Radio />}
              key={value.id}
              label={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <AttributeSwatch
                    hex={value.swatchHex}
                    imageUrl={value.swatchImageUrl}
                    label={value.nameUk}
                    size={20}
                  />
                  <span>
                    {value.nameUk} ({value.code})
                  </span>
                </Stack>
              }
              value={String(value.id)}
            />
          ))}
          <FormControlLabel
            control={<Radio />}
            label={`Це не ${code.attributeName.toLocaleLowerCase('uk')}: не використовувати у фільтрах`}
            value={noValue}
          />
        </RadioGroup>
      )}
      {shown.length === 0 && !valuesLoading ? (
        <Typography color="text.secondary" variant="body2">
          Такого значення немає. Додайте його в ознаці «{code.attributeName}», а потім поверніться
          сюди.
        </Typography>
      ) : null}
      <Alert severity="info">
        Рішення збережеться у словнику. Товари з цим кодом отримають значення під час наступного
        розпізнавання.
      </Alert>
      {error ? <Alert severity="error">{error}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={saving} onClick={onClose}>
          Скасувати
        </Button>
        <Button
          disabled={saving || choice === ''}
          onClick={() => onSave(choice === noValue ? null : Number(choice))}
          variant="contained"
        >
          {saving ? 'Збереження…' : `Зберегти для ${code.productCount} тов.`}
        </Button>
      </Stack>
    </Stack>
  );
}

/** The owner decodes a 1C code in the right-side panel: picks the value it means, or says it means none. */
export function CodeDecisionPanel(props: CodeDecisionPanelProps) {
  const { code } = props;
  return (
    <AdminEditPanel
      busy={props.saving}
      onClose={props.onClose}
      open={code !== undefined}
      subtitle={code ? `«${code.rawValue}» у ознаці «${code.attributeName}»` : undefined}
      title="Що означає код"
    >
      {code ? <DecisionForm {...props} code={code} key={code.aliasId} /> : null}
    </AdminEditPanel>
  );
}
