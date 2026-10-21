import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import type { OrderQuote } from '@admin/orders/model';

interface Props { open: boolean; quote: OrderQuote | null; ready: boolean; onClose: () => void; onConfirm: () => void }
const money = new Intl.NumberFormat('uk-UA', { style: 'currency', currency: 'UAH' });

export function ConfirmOrderDialog({ open, quote, ready, onClose, onConfirm }: Props) {
  return <Dialog onClose={onClose} open={open}>
    <DialogTitle>Підтвердити замовлення?</DialogTitle>
    <DialogContent><DialogContentText>Серверна сума: {quote ? money.format(quote.totalAmount) : '—'}. Після підтвердження замовлення буде передано до 1C за наявною job.</DialogContentText></DialogContent>
    <DialogActions><Button onClick={onClose}>Скасувати</Button><Button disabled={!ready} onClick={onConfirm} variant="contained">Підтвердити</Button></DialogActions>
  </Dialog>;
}
