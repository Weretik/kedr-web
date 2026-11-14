import { Box, MenuItem, Stack, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { WorkPeriod, WorkPerson } from '@admin/work/model';

export type WorkReportPreset = '7' | '30' | 'custom';

interface WorkReportFiltersProps {
  staff: readonly WorkPerson[];
  staffLoading: boolean;
  selected: string;
  onPersonChange: (userId: string) => void;
  preset: WorkReportPreset;
  onPresetChange: (preset: WorkReportPreset) => void;
  custom: WorkPeriod;
  onCustomChange: (period: WorkPeriod) => void;
}

/** «Хто» and the period of the report: 7 or 30 days, or own dates. */
export function WorkReportFilters({
  custom,
  onCustomChange,
  onPersonChange,
  onPresetChange,
  preset,
  selected,
  staff,
  staffLoading,
}: WorkReportFiltersProps) {
  return (
    <Box
      sx={{
        alignItems: 'center',
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'minmax(220px, 320px) auto 1fr' },
      }}
    >
      <TextField
        disabled={staffLoading || staff.length === 0}
        label="Хто"
        onChange={(event) => onPersonChange(event.target.value)}
        select
        size="small"
        value={selected}
      >
        {staff.map((member) => (
          <MenuItem key={member.id} value={member.id}>
            {member.name} · {member.roleLabel}
          </MenuItem>
        ))}
      </TextField>
      <ToggleButtonGroup
        aria-label="Період"
        exclusive
        onChange={(_event, value: WorkReportPreset | null) => value && onPresetChange(value)}
        size="small"
        value={preset}
      >
        <ToggleButton value="7">7 днів</ToggleButton>
        <ToggleButton value="30">30 днів</ToggleButton>
        <ToggleButton value="custom">Свій період</ToggleButton>
      </ToggleButtonGroup>
      {preset === 'custom' ? (
        <Stack direction="row" spacing={1}>
          <TextField
            label="З"
            onChange={(event) => onCustomChange({ ...custom, from: event.target.value })}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={custom.from}
          />
          <TextField
            label="По"
            onChange={(event) => onCustomChange({ ...custom, to: event.target.value })}
            size="small"
            slotProps={{ inputLabel: { shrink: true } }}
            type="date"
            value={custom.to}
          />
        </Stack>
      ) : null}
    </Box>
  );
}
