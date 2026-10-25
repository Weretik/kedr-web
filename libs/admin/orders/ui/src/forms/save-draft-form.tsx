import { SectionCard } from '@admin/shared/ui';
import { Button, TextField } from '@mui/material';

interface Props {
  title: string;
  note: string;
  ready: boolean;
  saving: boolean;
  onTitleChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
}

export function SaveDraftForm({
  title,
  note,
  ready,
  saving,
  onTitleChange,
  onNoteChange,
  onSave,
}: Props) {
  return (
    <SectionCard title="Зберегти як чернетку">
      <TextField
        label="Назва чернетки"
        onChange={(event) => onTitleChange(event.target.value)}
        value={title}
        slotProps={{ htmlInput: { maxLength: 200 } }}
      />
      <TextField
        label="Нотатка"
        multiline
        minRows={2}
        onChange={(event) => onNoteChange(event.target.value)}
        value={note}
        slotProps={{ htmlInput: { maxLength: 2000 } }}
      />
      <Button
        disabled={!ready || !title.trim() || saving}
        onClick={onSave}
        variant="outlined"
        sx={{ alignSelf: 'flex-start' }}
      >
        Зберегти чернетку
      </Button>
    </SectionCard>
  );
}
