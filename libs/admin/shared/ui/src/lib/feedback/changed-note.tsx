import { Typography } from '@mui/material';

const dateTime = new Intl.DateTimeFormat('uk-UA', { dateStyle: 'medium', timeStyle: 'short' });

/** «4 лист. 2026 р., 19:40 · manager@…»; the editor is left out when it was not recorded. */
export function formatChanged(at: string, by?: string | null): string {
  const when = dateTime.format(new Date(at));
  return by ? `${when} · ${by}` : when;
}

interface ChangedNoteProps {
  at: string;
  by?: string | null;
  /** «Змінено» by default; documents say «Опубліковано» or «Чернетку збережено». */
  label?: string;
}

/** One quiet line under a page heading: who saved the last change and when. */
export function ChangedNote({ at, by, label = 'Змінено' }: ChangedNoteProps) {
  return (
    <Typography color="text.secondary" variant="body2">
      {label}: {formatChanged(at, by)}
    </Typography>
  );
}
