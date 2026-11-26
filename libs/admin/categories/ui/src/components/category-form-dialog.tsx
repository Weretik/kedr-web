import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { useId } from 'react';

import type { FormEvent, ReactNode } from 'react';

interface CategoryFormDialogProps {
  open: boolean;
  title: string;
  /** The category the dialog acts on, under the title. */
  subtitle?: string;
  /** While a request runs the dialog cannot be closed. */
  busy: boolean;
  actions: ReactNode;
  children: ReactNode;
  onClose: () => void;
  onSubmit: () => void;
}

/** A form in a dialog: the category page has no side panels (spec 003 R-012). */
export function CategoryFormDialog(props: CategoryFormDialogProps) {
  const titleId = useId();
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    props.onSubmit();
  };

  return (
    <Dialog
      aria-labelledby={titleId}
      fullWidth
      maxWidth="sm"
      onClose={props.busy ? undefined : props.onClose}
      open={props.open}
    >
      <Box component="form" noValidate onSubmit={submit}>
        <DialogTitle id={titleId}>
          {props.title}
          {props.subtitle ? (
            <Typography
              color="text.secondary"
              component="span"
              sx={{ display: 'block' }}
              variant="body2"
            >
              {props.subtitle}
            </Typography>
          ) : null}
        </DialogTitle>
        <DialogContent dividers>{props.children}</DialogContent>
        <DialogActions>{props.actions}</DialogActions>
      </Box>
    </Dialog>
  );
}
