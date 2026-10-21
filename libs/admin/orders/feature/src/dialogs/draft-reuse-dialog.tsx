import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel, Radio, RadioGroup } from '@mui/material';

type Choice = 'draft' | 'choose' | null;
interface Props {
  open: boolean; customerName: string; hasCurrentLines: boolean; choice: Choice;
  onChoiceChange: (choice: Choice) => void; onClose: () => void; onConfirm: () => void;
}

export function DraftReuseDialog({ open, customerName, hasCurrentLines, choice, onChoiceChange, onClose, onConfirm }: Props) {
  return <Dialog onClose={onClose} open={open}>
    <DialogTitle>Додати товари чернетки?</DialogTitle>
    <DialogContent><DialogContentText>Товари додадуться до поточного набору. Джерельна чернетка залишиться доступною.</DialogContentText>
      {hasCurrentLines && <RadioGroup aria-label="Клієнт обʼєднаного набору" onChange={(_event, value) => onChoiceChange(value as Choice)} sx={{ mt: 2 }} value={choice ?? ''}>
        <FormControlLabel control={<Radio />} label={`Використати клієнта чернетки: ${customerName}`} value="draft" />
        <FormControlLabel control={<Radio />} label="Обрати клієнта на сторінці оформлення" value="choose" />
      </RadioGroup>}
    </DialogContent>
    <DialogActions><Button onClick={onClose}>Скасувати</Button><Button disabled={hasCurrentLines && !choice} onClick={onConfirm} variant="contained">Додати</Button></DialogActions>
  </Dialog>;
}
