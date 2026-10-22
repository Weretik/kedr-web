import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

interface Props {
  open: boolean;
  title: string;
  note: string;
  ready: boolean;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export function SaveDraftDialog({
  open,
  title,
  note,
  ready,
  saving,
  onTitleChange,
  onNoteChange,
  onClose,
  onSave,
}: Props) {
  const titleMissing = !title.trim();

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={saving ? undefined : onClose}
      open={open}
    >
      <DialogTitle>Зберегти як чернетку</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField
          error={titleMissing}
          fullWidth
          helperText={titleMissing ? 'Вкажіть назву чернетки.' : undefined}
          label="Назва чернетки"
          onChange={(event) => onTitleChange(event.target.value)}
          required
          slotProps={{ htmlInput: { maxLength: 200 } }}
          value={title}
        />
        <TextField
          fullWidth
          label="Нотатка"
          multiline
          minRows={2}
          onChange={(event) => onNoteChange(event.target.value)}
          slotProps={{ htmlInput: { maxLength: 2000 } }}
          value={note}
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={saving} onClick={onClose}>Скасувати</Button>
        <Button disabled={!ready || titleMissing || saving} onClick={onSave} variant="contained">
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
