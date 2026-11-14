import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import type { CreateStaffMode } from '../hooks/use-create-staff-form';

interface StaffSourceToggleProps {
  value: CreateStaffMode;
  onChange: (mode: CreateStaffMode) => void;
}

/** Switches «Новий користувач» between a new account and one already in the base. */
export function StaffSourceToggle({ onChange, value }: StaffSourceToggleProps) {
  return (
    <ToggleButtonGroup
      aria-label="Звідки користувач"
      exclusive
      fullWidth
      onChange={(_, next: CreateStaffMode | null) => {
        if (next) onChange(next);
      }}
      size="small"
      value={value}
    >
      <ToggleButton value="new">Новий</ToggleButton>
      <ToggleButton value="existing">З бази</ToggleButton>
    </ToggleButtonGroup>
  );
}
