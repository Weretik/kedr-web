import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

import type { DraftRecord } from '@admin/orders/model';

interface Props { draft: DraftRecord | null; error: string; deleting: boolean; onClose: () => void; onDelete: () => void }

export function DraftDeleteDialog({ draft, error, deleting, onClose, onDelete }: Props) {
  return <Dialog aria-labelledby="delete-draft-title" onClose={onClose} open={draft !== null}>
    <DialogTitle id="delete-draft-title">Видалити чернетку?</DialogTitle>
    <DialogContent><DialogContentText>Ви впевнені, що хочете видалити «{draft?.title}»?</DialogContentText>{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}</DialogContent>
    <DialogActions><Button onClick={onClose}>Скасувати</Button><Button color="error" disabled={deleting} onClick={onDelete} variant="contained">Видалити</Button></DialogActions>
  </Dialog>;
}
