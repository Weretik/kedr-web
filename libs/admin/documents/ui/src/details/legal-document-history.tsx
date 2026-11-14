import { formatDate } from '@admin/documents/model';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import type { LegalDocumentVersionSummary } from '@admin/documents/model';

const dateTime = (value: string) =>
  new Intl.DateTimeFormat('uk-UA', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(value),
  );

interface LegalDocumentHistoryProps {
  versions: LegalDocumentVersionSummary[];
  showsEditionDate: boolean;
  onOpen: (id: number) => void;
}

/** Published and archived editions, newest first; collapsed because it is rarely needed. */
export function LegalDocumentHistory({
  onOpen,
  showsEditionDate,
  versions,
}: LegalDocumentHistoryProps) {
  const editions = versions.filter((version) => version.status !== 'draft');

  return (
    <Accordion disableGutters variant="outlined">
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography sx={{ fontWeight: 600 }}>Історія редакцій ({editions.length})</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          {editions.map((version) => (
            <ListItem
              divider
              key={version.id}
              secondaryAction={
                <Button onClick={() => onOpen(version.id)} size="small">
                  Переглянути
                </Button>
              }
            >
              <ListItemText
                primary={[
                  `Редакція №${version.number}`,
                  showsEditionDate && version.effectiveFrom
                    ? `від ${formatDate(version.effectiveFrom)}`
                    : null,
                  version.status === 'published' ? '— зараз на сайті' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                secondary={
                  version.publishedAt
                    ? `Опублікував ${version.publishedBy ?? '—'}, ${dateTime(version.publishedAt)}`
                    : undefined
                }
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
