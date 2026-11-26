import { AdminEditPanel, ChangedNote } from '@admin/shared/ui';
import {
  siteRedirectFromMaxLength,
  siteRedirectIssues,
  siteRedirectLookupPath,
  siteRedirectToMaxLength,
} from '@admin/site-redirects/model';
import { Alert, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

import type { SiteRedirect, SiteRedirectDraft } from '@admin/site-redirects/model';

interface SiteRedirectPanelProps {
  /** The redirect to change, or `null` for a new one. Mount the panel per redirect (key). */
  redirect: SiteRedirect | null;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (draft: SiteRedirectDraft) => void;
}

/** Old address and new address of one redirect; the server checks duplicates and chains. */
export function SiteRedirectPanel({
  error,
  onCancel,
  onSave,
  redirect,
  saving,
}: SiteRedirectPanelProps) {
  const [draft, setDraft] = useState<SiteRedirectDraft>(
    redirect ? { from: redirect.from, to: redirect.to } : { from: '', to: '' },
  );
  const [touched, setTouched] = useState(false);
  const issues = siteRedirectIssues(draft);
  const valid = Object.keys(issues).length === 0;
  const stored = siteRedirectLookupPath(draft.from);
  const show = (field: keyof SiteRedirectDraft) => (touched ? issues[field] : undefined);

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={saving} onClick={onCancel}>
            Скасувати
          </Button>
          <Button disabled={saving} type="submit" variant="contained">
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </>
      }
      busy={saving}
      onClose={onCancel}
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) onSave(draft);
      }}
      open
      subtitle={redirect?.from}
      title={redirect ? 'Редагування переадресації' : 'Нова переадресація'}
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Typography color="text.secondary" variant="body2">
          Сайт відповідає на стару адресу постійною переадресацією (301) на нову. Зміни працюють на
          сайті протягом 5 хвилин.
        </Typography>
        <TextField
          error={Boolean(show('from'))}
          helperText={
            show('from') ??
            (stored && stored !== draft.from.trim()
              ? `Буде збережено як ${stored}`
              : 'Шлях на сайті, наприклад /uk/stara-storinka, або повне посилання.')
          }
          label="Стара адреса"
          onChange={(event) => setDraft({ ...draft, from: event.target.value })}
          required
          slotProps={{ htmlInput: { maxLength: siteRedirectToMaxLength + 100 } }}
          value={draft.from}
        />
        <TextField
          error={Boolean(show('to'))}
          helperText={
            show('to') ??
            `Кінцева адреса: шлях на сайті (/uk/catalog/...) або https://… До ${siteRedirectToMaxLength} символів.`
          }
          label="Нова адреса"
          onChange={(event) => setDraft({ ...draft, to: event.target.value })}
          required
          slotProps={{ htmlInput: { maxLength: siteRedirectToMaxLength } }}
          value={draft.to}
        />
        <Typography color="text.secondary" variant="caption">
          Стара адреса — до {siteRedirectFromMaxLength} символів. Головну сторінку переадресувати не
          можна.
        </Typography>
        {redirect ? <ChangedNote at={redirect.updatedAt} by={redirect.updatedBy} /> : null}
      </Stack>
    </AdminEditPanel>
  );
}
