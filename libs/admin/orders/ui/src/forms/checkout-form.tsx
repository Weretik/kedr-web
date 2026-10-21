import { Button, Card, CardContent, Stack, TextField, Typography } from '@mui/material';

import type { OrderQuote } from '@admin/orders/model';

interface Props {
  comment: string; quote: OrderQuote | null; ready: boolean; submitting: boolean;
  onCommentChange: (value: string) => void; onOpenConfirm: () => void;
}

const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

export function CheckoutForm({ comment, quote, ready, submitting, onCommentChange, onOpenConfirm }: Props) {
  return <Card variant="outlined"><CardContent><Stack spacing={2}>
    <Typography component="h2" variant="h6">Оформити замовлення</Typography>
    <TextField label="Коментар" multiline minRows={2} onChange={(event) => onCommentChange(event.target.value)} value={comment} slotProps={{ htmlInput: { maxLength: 1000 } }} />
    <Typography variant="h6">Разом: {quote ? money.format(quote.totalAmount) : 'Очікуємо розрахунок'}</Typography>
    <Button disabled={!ready || submitting} onClick={onOpenConfirm} variant="contained" sx={{ alignSelf: 'flex-start' }}>Оформити замовлення</Button>
  </Stack></CardContent></Card>;
}
