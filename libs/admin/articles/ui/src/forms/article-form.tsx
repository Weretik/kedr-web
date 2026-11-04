import { articleLanguages } from '@admin/articles/model';
import { SectionCard } from '@admin/shared/ui';
import { Alert, Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { ArticleSettingsFields } from './article-settings-fields';
import { ArticleTextFields } from './article-text-fields';

import type { ArticleDraft, ArticleDraftErrors, ArticleLanguage } from '@admin/articles/model';
import type { FormEvent } from 'react';

const languageLabels: Record<ArticleLanguage, string> = { uk: 'Українська', ru: 'Русский' };

interface ArticleFormProps {
  draft: ArticleDraft;
  errors?: ArticleDraftErrors;
  isNew: boolean;
  dirty: boolean;
  saving: boolean;
  /** Server error in the words of the page. */
  saveError?: string;
  onChange: (draft: ArticleDraft) => void;
  onReset: () => void;
  onSave: () => void;
}

/**
 * The whole article in one form: shared settings, then both languages in tabs. Both panes stay mounted so
 * unsaved text survives a tab switch; a tab with an error is marked.
 */
export function ArticleForm({
  dirty,
  draft,
  errors,
  isNew,
  onChange,
  onReset,
  onSave,
  saveError,
  saving,
}: ArticleFormProps) {
  const [language, setLanguage] = useState<ArticleLanguage>('uk');
  const set = (patch: Partial<ArticleDraft>) => onChange({ ...draft, ...patch });
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} spacing={3}>
      <SectionCard title="Публікація">
        <ArticleSettingsFields draft={draft} errors={errors} isNew={isNew} onChange={set} />
      </SectionCard>
      <SectionCard title="Текст">
        <Tabs
          aria-label="Мова статті"
          onChange={(_event, value: ArticleLanguage) => setLanguage(value)}
          sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
          value={language}
        >
          {articleLanguages.map((code) => (
            <Tab
              aria-controls={`article-text-${code}`}
              id={`article-text-tab-${code}`}
              key={code}
              label={
                errors?.texts?.[code] ? `${languageLabels[code]} — є помилки` : languageLabels[code]
              }
              sx={errors?.texts?.[code] ? { color: 'error.main' } : undefined}
              value={code}
            />
          ))}
        </Tabs>
        {articleLanguages.map((code) => (
          <Box
            aria-labelledby={`article-text-tab-${code}`}
            hidden={code !== language}
            id={`article-text-${code}`}
            key={code}
            role="tabpanel"
          >
            <ArticleTextFields
              errors={errors?.texts?.[code]}
              onChange={(text) => set({ texts: { ...draft.texts, [code]: text } })}
              text={draft.texts[code]}
            />
          </Box>
        ))}
      </SectionCard>
      {saveError ? <Alert severity="error">{saveError}</Alert> : null}
      <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
        {isNew ? null : (
          <Button disabled={!dirty || saving} onClick={onReset}>
            Скасувати зміни
          </Button>
        )}
        <Button disabled={(!isNew && !dirty) || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : isNew ? 'Створити статтю' : 'Зберегти'}
        </Button>
      </Stack>
    </Stack>
  );
}
