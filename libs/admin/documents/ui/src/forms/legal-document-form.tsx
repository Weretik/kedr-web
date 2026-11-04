import { legalDocumentLanguages, legalDocumentLimits } from '@admin/documents/model';
import { CountedTextField, RichTextEditor } from '@admin/shared/ui';
import { Box, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import type {
  LegalDocumentDraft,
  LegalDocumentDraftErrors,
  LegalDocumentLanguage,
} from '@admin/documents/model';

const languageLabels: Record<LegalDocumentLanguage, string> = { uk: 'Українська', ru: 'Русский' };

interface LegalDocumentFormProps {
  draft: LegalDocumentDraft;
  errors?: LegalDocumentDraftErrors;
  readOnly?: boolean;
  onChange?: (draft: LegalDocumentDraft) => void;
}

/**
 * Both languages in tabs; the panes stay mounted so unsaved text survives a tab switch, and a tab with an
 * error is marked. H2 headings become sections and the table of contents on the site.
 */
export function LegalDocumentForm({
  draft,
  errors,
  onChange,
  readOnly = false,
}: LegalDocumentFormProps) {
  const [language, setLanguage] = useState<LegalDocumentLanguage>('uk');
  const set = (code: LegalDocumentLanguage, patch: Partial<LegalDocumentDraft['texts']['uk']>) =>
    onChange?.({ texts: { ...draft.texts, [code]: { ...draft.texts[code], ...patch } } });

  return (
    <Box>
      <Tabs
        aria-label="Мова документа"
        onChange={(_event, value: LegalDocumentLanguage) => setLanguage(value)}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
        value={language}
      >
        {legalDocumentLanguages.map((code) => (
          <Tab
            aria-controls={`document-text-${code}`}
            id={`document-text-tab-${code}`}
            key={code}
            label={errors?.[code] ? `${languageLabels[code]} — є помилки` : languageLabels[code]}
            sx={errors?.[code] ? { color: 'error.main' } : undefined}
            value={code}
          />
        ))}
      </Tabs>
      {legalDocumentLanguages.map((code) => (
        <Stack
          aria-labelledby={`document-text-tab-${code}`}
          hidden={code !== language}
          id={`document-text-${code}`}
          key={code}
          role="tabpanel"
          spacing={2}
        >
          <CountedTextField
            readOnly={readOnly}
            error={errors?.[code]?.title}
            hint="Повна назва документа на сайті."
            label="Назва"
            maxLength={legalDocumentLimits.title}
            onChange={(title) => set(code, { title })}
            value={draft.texts[code].title}
          />
          <RichTextEditor
            allowQuotes
            error={errors?.[code]?.bodyHtml}
            label="Текст (заголовки H2 — розділи і зміст на сайті)"
            onChange={(bodyHtml) => set(code, { bodyHtml })}
            readOnly={readOnly}
            value={draft.texts[code].bodyHtml}
          />
        </Stack>
      ))}
    </Box>
  );
}
