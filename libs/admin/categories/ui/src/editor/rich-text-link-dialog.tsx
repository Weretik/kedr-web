import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { validateLinkHref } from './rich-text-extensions';

import type { FormEvent } from 'react';

interface RichTextLinkDialogProps {
  open: boolean;
  initialHref: string;
  onClose: () => void;
  onSubmit: (href: string) => void;
}

export function RichTextLinkDialog({
  initialHref,
  onClose,
  onSubmit,
  open,
}: RichTextLinkDialogProps) {
  const [href, setHref] = useState(initialHref);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (open) {
      setHref(initialHref);
      setError(undefined);
    }
  }, [initialHref, open]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const validationError = validateLinkHref(href);
    setError(validationError);
    if (!validationError) onSubmit(href.trim());
  };

  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <form noValidate onSubmit={handleSubmit}>
        <DialogTitle>Посилання</DialogTitle>
        <DialogContent>
          <TextField
            error={Boolean(error)}
            fullWidth
            helperText={error ?? 'Наприклад, /uk/catalog/zavisy або https://example.com'}
            label="Адреса посилання"
            margin="dense"
            onChange={(event) => setHref(event.target.value)}
            value={href}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Скасувати</Button>
          <Button type="submit" variant="contained">
            Готово
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
