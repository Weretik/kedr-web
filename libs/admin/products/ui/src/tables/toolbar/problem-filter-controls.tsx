import { problemReasonLabel } from '@admin/products/model';
import { FormControlLabel, MenuItem, Switch, TextField } from '@mui/material';

export interface ProblemFilterProps {
  problemsOnly: boolean;
  reason: string | undefined;
  /** Reasons of on-site products with their counts, most frequent first. */
  reasons: readonly { code: string; productCount: number }[];
  onChange: (problemsOnly: boolean, reason: string | undefined) => void;
}

/** «Тільки проблемні» and the reason filter of the «На сайті» tab. */
export function ProblemFilterControls({
  onChange,
  problemsOnly,
  reason,
  reasons,
}: ProblemFilterProps) {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={problemsOnly || reason !== undefined}
            onChange={(_event, checked) => onChange(checked, undefined)}
            size="small"
          />
        }
        label="Тільки проблемні"
        sx={{ mr: 0 }}
      />
      <TextField
        label="Причина"
        onChange={(event) => {
          const value = event.target.value;
          onChange(value !== '' || problemsOnly, value || undefined);
        }}
        select
        size="small"
        sx={{ minWidth: 220, maxWidth: 320 }}
        value={reason ?? ''}
      >
        <MenuItem value="">Усі причини</MenuItem>
        {reason && !reasons.some((item) => item.code === reason) ? (
          <MenuItem value={reason}>{problemReasonLabel(reason)}</MenuItem>
        ) : null}
        {reasons.map((item) => (
          <MenuItem key={item.code} value={item.code}>
            {problemReasonLabel(item.code)} ({item.productCount})
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
