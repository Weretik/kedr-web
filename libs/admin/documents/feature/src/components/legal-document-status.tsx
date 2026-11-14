import { legalDocumentSiteState } from '@admin/documents/ui';
import { ChangedNote } from '@admin/shared/ui';
import { Stack, Typography } from '@mui/material';

import type { LegalDocumentOverview } from '@admin/documents/model';

/** What the site shows now and whether an unpublished draft is waiting. */
export function LegalDocumentStatus({ overview }: { overview: LegalDocumentOverview }) {
  const { draft, published } = overview;
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2">{legalDocumentSiteState(overview)}</Typography>
      {published?.publishedAt ? (
        <ChangedNote at={published.publishedAt} by={published.publishedBy} label="Опубліковано" />
      ) : null}
      <Typography color={draft ? 'warning.main' : 'text.secondary'} variant="body2">
        {draft
          ? `Є неопублікована чернетка: збережено ${new Date(draft.updatedAt).toLocaleString('uk-UA')}, ${draft.updatedBy}. Відвідувачі бачать текст, що на сайті.`
          : 'Нижче — текст, що на сайті. Змініть його і натисніть «Опублікувати».'}
      </Typography>
    </Stack>
  );
}
