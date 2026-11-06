import { MenuItem, TextField } from '@mui/material';

import type { WorkPerson } from '@admin/work/model';

interface WorkAssigneeFieldProps {
  people: readonly WorkPerson[];
  value: string;
  onChange: (personId: string) => void;
  disabled?: boolean;
}

/** «Для кого»: the person whose «План» receives the new task. */
export function WorkAssigneeField({ disabled, onChange, people, value }: WorkAssigneeFieldProps) {
  return (
    <TextField
      disabled={disabled || people.length === 0}
      helperText="Задача зʼявиться в «План» цієї людини та в її «Огляді»."
      label="Для кого"
      onChange={(event) => onChange(event.target.value)}
      select
      value={value}
    >
      {people.map((person) => (
        <MenuItem key={person.id} value={person.id}>
          {person.name} · {person.roleLabel}
        </MenuItem>
      ))}
    </TextField>
  );
}
