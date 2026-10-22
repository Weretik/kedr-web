import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';

import type { OrderQuote } from '@admin/orders/model';

interface Props {
  open: boolean;
  comment: string;
  quote: OrderQuote | null;
  ready: boolean;
  submitting: boolean;
  onCommentChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

export function SubmitOrderDialog({
  open,
  comment,
  quote,
  ready,
  submitting,
  onCommentChange,
  onClose,
  onSubmit,
}: Props) {
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={submitting ? undefined : onClose}
      open={open}
    >
      <DialogTitle>Оформити замовлення</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          fullWidth
          label="Коментар"
          multiline
          minRows={2}
          onChange={(event) => onCommentChange(event.target.value)}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
          value={comment}
        />
        <Typography component="p" variant="h6">
          Підтверджена сума: {quote ? money.format(quote.totalAmount) : 'Очікуємо розрахунок'}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={submitting} onClick={onClose}>Скасувати</Button>
        <Button disabled={!ready || submitting} onClick={onSubmit} variant="contained">
          Відправити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
