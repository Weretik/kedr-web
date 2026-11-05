import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

interface SiteModelNameDialogProps {
  title: string;
  /** For example «У моделі буде 3 товари з категорії Ручки». */
  description?: string;
  initialName: string;
  submitLabel: string;
  saving: boolean;
  error: string | null;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

const maxName = 300;

/** The name of a new or renamed model; the site address is not changed by a rename. */
export function SiteModelNameDialog(props: SiteModelNameDialogProps) {
  const [name, setName] = useState(props.initialName);
  const trimmed = name.trim();
  return (
    <Dialog fullWidth maxWidth="sm" onClose={props.saving ? undefined : props.onCancel} open>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (trimmed && trimmed.length <= maxName) props.onSubmit(trimmed);
        }}
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            {props.description ? (
              <Typography color="text.secondary" variant="body2">
                {props.description}
              </Typography>
            ) : null}
            <TextField
              error={trimmed.length > maxName}
              fullWidth
              helperText={`${trimmed.length} / ${maxName}`}
              label="Назва моделі"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />
            {props.error ? <Alert severity="error">{props.error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button disabled={props.saving} onClick={props.onCancel}>
            Скасувати
          </Button>
          <Button
            disabled={props.saving || !trimmed || trimmed.length > maxName}
            type="submit"
            variant="contained"
          >
            {props.submitLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
