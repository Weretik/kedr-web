import { Alert, Button, Stack } from '@mui/material';

interface FormSaveBarProps {
  dirty: boolean;
  saving: boolean;
  /** Server error in the words of the page. */
  saveError?: string;
  onReset: () => void;
}

/** The server error and the «Скасувати зміни» / «Зберегти» buttons under a company form. */
export function FormSaveBar({ dirty, onReset, saveError, saving }: FormSaveBarProps) {
  return (
    <>
      {saveError ? <Alert severity="error">{saveError}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        <Button disabled={!dirty || saving} onClick={onReset}>
          Скасувати зміни
        </Button>
        <Button disabled={!dirty || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </Stack>
    </>
  );
}
