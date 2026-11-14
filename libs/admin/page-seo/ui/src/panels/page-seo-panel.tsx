import {
  pageSeoDescriptionMaxLength,
  pageSeoDescriptionShownLength,
  pageSeoIssues,
  pageSeoTitleMaxLength,
  pageSeoTitleShownLength,
} from '@admin/page-seo/model';
import { AdminEditPanel, ChangedNote, CountedTextField } from '@admin/shared/ui';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { PageSeoEntry, PageSeoTexts } from '@admin/page-seo/model';

interface PageSeoPanelProps {
  entry: PageSeoEntry;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (texts: PageSeoTexts) => void;
}

const languages = [
  { label: 'Українською', title: 'titleUk', description: 'descriptionUk' },
  { label: 'Російською', title: 'titleRu', description: 'descriptionRu' },
] as const;

const titleHint = `Порожнє — сайт покаже свій заголовок. Google зазвичай показує до ${pageSeoTitleShownLength} символів.`;
const descriptionHint = `Порожнє — сайт покаже свій опис. Google зазвичай показує до ${pageSeoDescriptionShownLength} символів.`;

/** The search title and description of one page in both languages. Mount it per page (key). */
export function PageSeoPanel({ entry, error, onCancel, onSave, saving }: PageSeoPanelProps) {
  const [texts, setTexts] = useState(entry.texts);
  const issues = pageSeoIssues(texts);
  const valid = Object.keys(issues).length === 0;

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={saving} onClick={onCancel}>
            Скасувати
          </Button>
          <Button disabled={saving || !valid} onClick={() => onSave(texts)} variant="contained">
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </>
      }
      busy={saving}
      onClose={onCancel}
      open
      subtitle={entry.path}
      title={`SEO: ${entry.label}`}
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Typography color="text.secondary" variant="body2">
          Заголовок і опис сторінки в пошуку Google і в превʼю посилання. На самій сторінці їх не
          видно.
        </Typography>
        <Box sx={{ display: 'grid', gap: 3 }}>
          {languages.map((language) => (
            <Box key={language.label} sx={{ alignContent: 'start', display: 'grid', gap: 2 }}>
              <Typography color="text.secondary" variant="overline">
                {language.label}
              </Typography>
              <CountedTextField
                error={issues[language.title]}
                hint={titleHint}
                label="SEO-заголовок"
                maxLength={pageSeoTitleMaxLength}
                onChange={(value) => setTexts({ ...texts, [language.title]: value })}
                value={texts[language.title]}
              />
              <CountedTextField
                error={issues[language.description]}
                hint={descriptionHint}
                label="SEO-опис"
                maxLength={pageSeoDescriptionMaxLength}
                multiline
                onChange={(value) => setTexts({ ...texts, [language.description]: value })}
                value={texts[language.description]}
              />
            </Box>
          ))}
        </Box>
        {entry.updatedAt ? <ChangedNote at={entry.updatedAt} by={entry.updatedBy} /> : null}
      </Stack>
    </AdminEditPanel>
  );
}
