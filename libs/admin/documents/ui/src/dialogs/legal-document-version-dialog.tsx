import { versionToDraft } from '@admin/documents/model';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';

import { LegalDocumentForm } from '../forms/legal-document-form';

import type { LegalDocumentVersion } from '@admin/documents/model';

interface LegalDocumentVersionDialogProps {
  version?: LegalDocumentVersion;
  loading: boolean;
  onClose: () => void;
  /** Starts a draft from this text; offered only when no draft exists. */
  onCopy?: (version: LegalDocumentVersion) => void;
}

/** An old edition, read-only; its text can become the start of a new draft. */
export function LegalDocumentVersionDialog({
  loading,
  onClose,
  onCopy,
  version,
}: LegalDocumentVersionDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={Boolean(version) || loading}>
      <DialogTitle>{version ? `Редакція №${version.number}` : 'Завантаження…'}</DialogTitle>
      <DialogContent dividers>
        {version ? (
          <LegalDocumentForm draft={versionToDraft(version)} readOnly />
        ) : (
          <Typography color="text.secondary">Завантаження редакції…</Typography>
        )}
      </DialogContent>
      <DialogActions>
        {version && onCopy ? (
          <Button onClick={() => onCopy(version)}>Взяти цей текст у чернетку</Button>
        ) : null}
        <Button onClick={onClose} variant="contained">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
