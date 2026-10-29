import { ConfirmActionDialog } from '@admin/users/ui';
import { Avatar, Box } from '@mui/material';

import type { ConfirmedChange } from '../hooks/use-confirmed-change';

/** Confirmation of any pending change, with the photo preview when there is one. */
export function ChangeConfirmationDialog({ change }: { change: ConfirmedChange }) {
  const { pending } = change;

  return (
    <ConfirmActionDialog
      confirmLabel={pending?.confirmLabel ?? ''}
      description={pending?.description ?? ''}
      destructive={pending?.destructive}
      error={change.error}
      onCancel={change.cancel}
      onConfirm={() => void change.confirm()}
      open={pending !== null}
      submitting={change.submitting}
      title={pending?.title ?? ''}
    >
      {pending?.previewUrl ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Avatar alt="Нове фото" src={pending.previewUrl} sx={{ height: 112, width: 112 }} />
        </Box>
      ) : null}
    </ConfirmActionDialog>
  );
}
