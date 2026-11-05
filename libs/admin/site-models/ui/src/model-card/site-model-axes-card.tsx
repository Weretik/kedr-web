import { SectionCard } from '@admin/shared/ui';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Autocomplete, Button, Chip, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { AttributeOption, SiteModelAxis } from '@admin/site-models/model';

interface SiteModelAxesCardProps {
  axes: readonly SiteModelAxis[];
  /** Attributes a person may add; number attributes cannot be switchers. */
  options: readonly AttributeOption[];
  busy: boolean;
  error: string | null;
  onChange: (attributeIds: number[]) => void;
}

const maxAxes = 6;

/** «Чим відрізняються товари»: the switchers of the model page, in order. */
export function SiteModelAxesCard({
  axes,
  busy,
  error,
  onChange,
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
        <Autocomplete
          autoHighlight
          getOptionLabel={(option) => option.name}
          onBlur={() => setAdding(false)}
          onChange={(_event, option) => {
            setAdding(false);
            if (option) onChange([...ids, option.id]);
          }}
          openOnFocus
          options={[...available]}
          renderInput={(params) => <TextField {...params} label="Ознака" size="small" />}
        />
      ) : null}
    </SectionCard>
  );
}
