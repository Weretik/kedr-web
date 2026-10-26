import { Alert, Button, Stack } from '@mui/material';

import { acceptExternalOrderSet, keepCurrentOrderSet } from '../state/current-order-set';

import type { CurrentOrderSet } from '../state/current-order-set';

/** Storage problems of the local order set: damaged data, failed save, or a change from another tab. */
export function CurrentOrderSetAlert({ warning }: { warning: CurrentOrderSet['warning'] }) {
  if (warning === 'invalid')
    return (
      <Alert severity="warning">Збережений локальний набір був пошкоджений і не відновився.</Alert>
    );
  if (warning === 'storage')
    return (
      <Alert severity="warning">
        Браузер не зберіг зміни. Не закривайте вкладку, доки не оформите або не збережете чернетку.
      </Alert>
    );
  if (warning === 'conflict')
    return (
      <Alert
        action={
          <Stack direction="row">
            <Button onClick={acceptExternalOrderSet}>Завантажити зміни</Button>
            <Button onClick={keepCurrentOrderSet}>Залишити мої</Button>
          </Stack>
        }
        severity="warning"
      >
        Інша вкладка змінила поточний набір. Оберіть версію.
      </Alert>
    );
  return null;
}
