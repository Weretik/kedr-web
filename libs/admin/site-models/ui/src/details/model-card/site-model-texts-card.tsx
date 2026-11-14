import { CountedTextField, SectionCard } from '@admin/shared/ui';
import { siteModelText, siteModelTextLimits } from '@admin/site-models/model';
import { Alert, Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import type { SiteModel, SiteModelLanguage, SiteModelTextInput } from '@admin/site-models/model';

interface SiteModelTextsCardProps {
  model: SiteModel;
  saving: boolean;
  error: string | null;
  /** Resolves true when saved; the draft of that language is then dropped. */
  onSave: (language: SiteModelLanguage, text: SiteModelTextInput) => Promise<boolean>;
}

const languageNames: Record<SiteModelLanguage, string> = { uk: 'Українська', ru: 'Російська' };

/** How the model page looks in Google search results. */
function SearchPreview({ slug, text }: { slug: string; text: SiteModelTextInput }) {
  return (
    <Box
      aria-label="Як виглядатиме в Google"
      component="figure"
      sx={{ border: 1, borderColor: 'divider', borderRadius: 2, m: 0, p: 2 }}
    >
      <Typography color="text.secondary" variant="caption">
        classkedr.com.ua › {slug}
      </Typography>
      <Typography sx={{ color: 'info.main', overflowWrap: 'anywhere' }} variant="subtitle1">
        {text.seoTitle.trim() || 'Без SEO-заголовка'}
      </Typography>
      <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }} variant="body2">
        {text.seoDescription.trim() || 'Без SEO-опису: Google візьме текст зі сторінки.'}
      </Typography>
    </Box>
  );
}

/** SEO and descriptions of the model page in two languages; each language is saved on its own. */
export function SiteModelTextsCard({ error, model, onSave, saving }: SiteModelTextsCardProps) {
  const [language, setLanguage] = useState<SiteModelLanguage>('uk');
  const [drafts, setDrafts] = useState<Partial<Record<SiteModelLanguage, SiteModelTextInput>>>({});
  const saved = siteModelText(model, language);
  const draft = drafts[language] ?? saved;
  const changed = (Object.keys(saved) as (keyof SiteModelTextInput)[]).some(
    (key) => draft[key] !== saved[key],
  );
  const tooLong = (Object.keys(siteModelTextLimits) as (keyof SiteModelTextInput)[]).some(
    (key) => draft[key].trim().length > siteModelTextLimits[key],
  );
  const update = (key: keyof SiteModelTextInput, value: string) =>
    setDrafts((current) => ({ ...current, [language]: { ...draft, [key]: value } }));

  return (
    <SectionCard title="SEO та опис">
      <Tabs
        aria-label="Мова текстів"
        onChange={(_event, value: SiteModelLanguage) => setLanguage(value)}
        value={language}
      >
        {(['uk', 'ru'] as const).map((item) => (
          <Tab key={item} label={languageNames[item]} value={item} />
        ))}
      </Tabs>
      <Stack spacing={2}>
        <CountedTextField
          hint="Заголовок у пошуку Google"
          label="SEO-заголовок"
          maxLength={siteModelTextLimits.seoTitle}
          onChange={(value) => update('seoTitle', value)}
          value={draft.seoTitle}
        />
        <CountedTextField
          hint="Опис під заголовком у Google"
          label="SEO-опис"
          maxLength={siteModelTextLimits.seoDescription}
          multiline
          onChange={(value) => update('seoDescription', value)}
          value={draft.seoDescription}
        />
        <SearchPreview slug={model.slug} text={draft} />
        <CountedTextField
          hint="Під назвою на сторінці моделі"
          label="Короткий опис"
          maxLength={siteModelTextLimits.shortDescription}
          multiline
          onChange={(value) => update('shortDescription', value)}
          value={draft.shortDescription}
        />
        <CountedTextField
          label="Повний опис"
          maxLength={siteModelTextLimits.description}
          multiline
          onChange={(value) => update('description', value)}
          value={draft.description}
        />
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
          <Button
            disabled={!changed || saving}
            onClick={() => setDrafts((current) => ({ ...current, [language]: undefined }))}
          >
            Скасувати
          </Button>
          <Button
            disabled={!changed || tooLong || saving}
            onClick={() =>
              void onSave(language, draft).then(
                (ok) => ok && setDrafts((current) => ({ ...current, [language]: undefined })),
              )
            }
            variant="contained"
          >
            Зберегти
          </Button>
        </Stack>
      </Stack>
    </SectionCard>
  );
}
