import { useRetryOrderSyncMutation } from '@admin/orders/data-access';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { Button, Stack, Typography } from '@mui/material';

/** The audit reason the server stores for this press (KedrStore platform spec 006, R-015). */
const sendNowReason = 'Надіслати зараз';

function sendNowErrorMessage(error: unknown): string {
  return (error as { status?: number } | undefined)?.status === 409
    ? 'Стан замовлення вже змінився. Оновіть сторінку.'
    : 'Не вдалося надіслати зараз. Спробуйте ще раз.';
}

/**
 * «Надіслати зараз» for an order that waits for its next automatic attempt: the attempt becomes due now and the next
 * run of «Відправка замовлень в 1С» (every 5 minutes) sends it, instead of waiting out the pause of up to an hour.
 */
export function OrderSyncSendNowButton({
  orderId,
  onSent,
}: {
  orderId: number;
  onSent: () => void;
}) {
  const [retry, { isLoading, error }] = useRetryOrderSyncMutation();
  return (
    <Stack spacing={0.5} sx={{ alignItems: 'flex-end' }}>
      <Button
        disabled={isLoading}
        onClick={() => {
          if (isLoading) return;
          void retry({ orderId, reason: sendNowReason })
            .unwrap()
            .then(onSent)
            .catch(() => undefined);
        }}
        startIcon={<SendOutlinedIcon />}
        variant="outlined"
      >
        Надіслати зараз
      </Button>
      {error ? (
        <Typography color="error" role="alert" variant="caption">
          {sendNowErrorMessage(error)}
        </Typography>
      ) : null}
    </Stack>
  );
}
