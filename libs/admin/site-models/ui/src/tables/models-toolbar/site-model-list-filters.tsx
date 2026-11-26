import { MenuItem, TextField } from '@mui/material';

import type { SiteModelStatus, SiteProblemFilter } from '@admin/site-models/model';

interface SiteModelListFiltersProps {
  status: SiteModelStatus | undefined;
  problem: SiteProblemFilter | undefined;
  onStatusChange: (status: SiteModelStatus | undefined) => void;
  onProblemChange: (problem: SiteProblemFilter | undefined) => void;
}

const statuses: { value: SiteModelStatus | ''; label: string }[] = [
  { value: '', label: 'Усі' },
  { value: 'accepted', label: 'Прийняті' },
  { value: 'proposed', label: 'Не перевірені' },
];

const problems: { value: SiteProblemFilter | ''; label: string }[] = [
  { value: '', label: 'Усі моделі' },
  { value: 'any', label: 'Будь-що' },
  { value: 'model_no_seo', label: 'SEO' },
  { value: 'model_no_axes', label: 'Перемикачі' },
  { value: 'model_no_photo', label: 'Фото' },
  { value: 'missing_axis_value', label: 'Значення ознак' },
];

/** «Статус» and «Чого бракує» selects of the «Моделі» toolbar. */
export function SiteModelListFilters(props: SiteModelListFiltersProps) {
  return (
    <>
      <TextField
        label="Статус"
        onChange={(event) =>
          props.onStatusChange((event.target.value || undefined) as SiteModelStatus | undefined)
        }
        select
        size="small"
        sx={{ minWidth: 160 }}
        value={props.status ?? ''}
      >
        {statuses.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Чого бракує"
        onChange={(event) =>
          props.onProblemChange((event.target.value || undefined) as SiteProblemFilter | undefined)
        }
        select
        size="small"
        sx={{ minWidth: 180 }}
        value={props.problem ?? ''}
      >
        {problems.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
