import { formatDate, legalDocumentKinds } from '@admin/documents/model';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Chip, List, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';

import type { LegalDocumentKind, LegalDocumentOverview } from '@admin/documents/model';

/** What the site shows now; a draft is marked because it is not on the site yet. */
export function legalDocumentSiteState({ kind, published }: LegalDocumentOverview): string {
  if (!published?.number) return 'Ще не опубліковано';
  return legalDocumentKinds[kind].showsEditionDate && published.effectiveFrom
    ? `На сайті: редакція №${published.number} від ${formatDate(published.effectiveFrom)}`
    : `На сайті: редакція №${published.number}`;
}

/** The four documents; a row opens its editor. */
interface LegalDocumentsListProps {
  documents: LegalDocumentOverview[];
  onOpen: (kind: LegalDocumentKind) => void;
}

export function LegalDocumentsList({ documents, onOpen }: LegalDocumentsListProps) {
  return (
    <Paper variant="outlined">
      <List disablePadding>
        {documents.map((document, index) => (
          <ListItemButton
            divider={index < documents.length - 1}
            key={document.kind}
            onClick={() => onOpen(document.kind)}
          >
            <ListItemText
              primary={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography component="span" sx={{ fontWeight: 600 }}>
                    {legalDocumentKinds[document.kind].label}
                  </Typography>
                  {document.draft ? (
                    <Chip
                      color="warning"
                      label="Є неопублікована чернетка"
                      size="small"
                      variant="outlined"
                    />
                  ) : null}
                </Stack>
              }
              secondary={legalDocumentSiteState(document)}
            />
            <ChevronRightIcon color="action" />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
