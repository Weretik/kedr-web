import { Button, Stack } from '@mui/material';

interface LegalDocumentActionsProps {
  dirty: boolean;
  hasDraft: boolean;
  saving: boolean;
  publishing: boolean;
  discarding: boolean;
  onDiscard: () => void;
  onReset: () => void;
  onSave: () => void;
  onPublish: () => void;
}

/** Buttons under the document form: discard the draft, undo edits, save a draft, publish. */
export function LegalDocumentActions({
  dirty,
  discarding,
  hasDraft,
  onDiscard,
  onPublish,
  onReset,
  onSave,
  publishing,
  saving,
}: LegalDocumentActionsProps) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ flexWrap: 'wrap', justifyContent: 'flex-end', rowGap: 1 }}
    >
      {hasDraft ? (
        <Button color="error" disabled={discarding} onClick={onDiscard}>
          Видалити чернетку
        </Button>
      ) : null}
      <Button disabled={!dirty || saving} onClick={onReset}>
        Скасувати зміни
      </Button>
      <Button disabled={!dirty || saving} onClick={onSave} variant="outlined">
        {saving ? 'Збереження…' : 'Зберегти чернетку'}
      </Button>
      <Button
        disabled={(!dirty && !hasDraft) || publishing}
        onClick={onPublish}
        variant="contained"
      >
        Опублікувати
      </Button>
    </Stack>
  );
}
