import { Alert, Button, Stack, TextField } from '@mui/material';
import { useState } from 'react';

interface SiteModelNameFormProps {
  initialName: string;
  submitLabel: string;
  /** For example «Адреса сторінки на сайті не зміниться». */
  helperText?: string;
  saving: boolean;
  error: string | null;
  onCancel?: () => void;
  onSubmit: (name: string) => void;
}

const maxName = 300;

/** The model name edited in place, inside the model pane: a rename or the name of a new model. */
export function SiteModelNameForm(props: SiteModelNameFormProps) {
  const [name, setName] = useState(props.initialName);
  const trimmed = name.trim();
  return (
    <Stack
      component="form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (trimmed) props.onSubmit(trimmed);
      }}
      spacing={1.5}
    >
      <TextField
        error={trimmed.length === 0}
        helperText={trimmed.length === 0 ? 'Вкажіть назву.' : props.helperText}
        label="Назва моделі"
        onChange={(event) => setName(event.target.value)}
        size="small"
        slotProps={{ htmlInput: { maxLength: maxName } }}
        value={name}
      />
      {props.error ? <Alert severity="error">{props.error}</Alert> : null}
      <Stack direction="row" spacing={1}>
        <Button disabled={props.saving || !trimmed} type="submit" variant="contained">
          {props.submitLabel}
        </Button>
        {props.onCancel ? (
          <Button disabled={props.saving} onClick={props.onCancel}>
            Скасувати
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
