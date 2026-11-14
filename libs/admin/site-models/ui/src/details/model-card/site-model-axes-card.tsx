import { SectionCard } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Button, Chip, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import { CreatablePicker } from '../../components/creatable-picker';

import type { AttributeOption, SiteModelAxis } from '@admin/site-models/model';

interface SiteModelAxesCardProps {
  axes: readonly SiteModelAxis[];
  /** Attributes a person may add; number attributes cannot be switchers. */
  options: readonly AttributeOption[];
  busy: boolean;
  error: string | null;
  onChange: (attributeIds: number[]) => void;
  /** Creates a list attribute with this name (spec catalog/007 M-06) and returns its id. */
  onCreateAttribute: (name: string) => Promise<number | undefined>;
}

const maxAxes = 6;

/**
 * «Чим відрізняються товари»: the switchers of the model page, in order. A name no attribute has offers «Створити
 * ознаку», so a new switcher is added without leaving the model.
 */
export function SiteModelAxesCard({
  axes,
  busy,
  error,
  onChange,
  onCreateAttribute,
  options,
}: SiteModelAxesCardProps) {
  const [adding, setAdding] = useState(false);
  const ids = axes.map((axis) => axis.attributeId);
  const offered = axes.length > 0 && axes.every((axis) => !axis.isSaved);
  const available = options.filter(
    (option) => option.kind !== 'number' && !ids.includes(option.id),
  );

  return (
    <SectionCard
      action={
        axes.length < maxAxes ? (
          <Button
            disabled={busy}
            onClick={() => setAdding(true)}
            size="small"
            startIcon={<AddIcon />}
          >
            Додати ознаку
          </Button>
        ) : null
      }
      title="Чим відрізняються товари"
    >
      <Typography color="text.secondary" variant="body2">
        Ці ознаки стають перемикачами на сторінці моделі: покупець вибирає колір, розмір чи сторону.
      </Typography>
      {offered ? (
        <Alert severity="info">
          Ознаки запропоновано автоматично. Вони збережуться, коли модель буде прийнято.
        </Alert>
      ) : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      {axes.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Ознак ще немає.
        </Typography>
      ) : (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }} useFlexGap>
          {axes.map((axis) => (
            <Chip
              disabled={busy}
              key={axis.attributeId}
              label={axis.name}
              onDelete={() => onChange(ids.filter((id) => id !== axis.attributeId))}
              variant={axis.isSaved ? 'filled' : 'outlined'}
            />
          ))}
        </Stack>
      )}
      {adding ? (
        <CreatablePicker
          ariaLabel="Ознака"
          autoFocus
          createText="Створити ознаку"
          label="Ознака"
          onBlur={() => setAdding(false)}
          onCreate={onCreateAttribute}
          onPick={(id) => {
            setAdding(false);
            onChange([...ids, id]);
          }}
          options={available}
          value={null}
        />
      ) : null}
    </SectionCard>
  );
}
