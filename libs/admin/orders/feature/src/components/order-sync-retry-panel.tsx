import { useRetryOrderSyncMutation } from '@admin/orders/data-access';
import { AdminEditPanel, CountedTextField } from '@admin/shared/ui';
import { Alert, Button, Typography } from '@mui/material';
import { useState } from 'react';

const reasonMaxLength = 500;

interface Props {
  open: boolean;
  orderId: number;
  orderNumber: string;
  onClose: () => void;
  onRetried: () => void;
}

function retryErrorMessage(error: unknown): string {
  switch ((error as { status?: number } | undefined)?.status) {
    case 409:
      return 'Стан замовлення вже змінився: його прийняли в 1С або воно вже в черзі. Оновіть сторінку.';
    case 404:
      return 'Замовлення не знайдено.';
    default:
      return 'Не вдалося поставити замовлення в чергу. Спробуйте ще раз.';
  }
}

/** «Повторити»: asks why, then puts the order back in the queue to 1C; the next run sends it. */
export function OrderSyncRetryPanel({ open, orderId, orderNumber, onClose, onRetried }: Props) {
  const [retry, { isLoading, error, reset }] = useRetryOrderSyncMutation();
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const trimmed = reason.trim();
  const reasonError =
    touched && !trimmed ? 'Вкажіть, що виправили, щоб повтор мав сенс.' : undefined;

  const close = () => {
    setReason('');
    setTouched(false);
    reset();
    onClose();
  };

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={isLoading} onClick={close}>
            Скасувати
          </Button>
          <Button disabled={isLoading} type="submit" variant="contained">
            Повторити
          </Button>
        </>
      }
      busy={isLoading}
      onClose={close}
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (!trimmed || trimmed.length > reasonMaxLength || isLoading) return;
        void retry({ orderId, reason: trimmed })
          .unwrap()
          .then(() => {
            close();
            onRetried();
          })
          .catch(() => undefined);
      }}
      open={open}
      subtitle={orderNumber}
      title="Повторна відправка в 1С"
    >
      <Typography color="text.secondary" variant="body2">
        Замовлення стане в чергу з тим самим номером, і найближчий запуск надішле його в 1С.
        Спочатку виправте причину: дані клієнта чи товарів або зв’язок з 1С.
      </Typography>
      {error ? <Alert severity="error">{retryErrorMessage(error)}</Alert> : null}
      <CountedTextField
        error={reasonError}
        label="Що виправлено"
        maxLength={reasonMaxLength}
        multiline
        onChange={setReason}
        value={reason}
      />
    </AdminEditPanel>
  );
}
