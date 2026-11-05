import { wholesaleLanguages } from '@admin/wholesale-content/model';
import { Alert, Box, Button, Stack, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { WholesaleTextFields } from './wholesale-text-fields';

import type {
  WholesaleDraft,
  WholesaleDraftErrors,
  WholesaleLanguage,
} from '@admin/wholesale-content/model';
import type { FormEvent } from 'react';

const languageLabels: Record<WholesaleLanguage, string> = { uk: 'Українська', ru: 'Русский' };

interface WholesaleFormProps {
  draft: WholesaleDraft;
  errors?: WholesaleDraftErrors;
  dirty: boolean;
  saving: boolean;
  /** Server error in the words of the page. */
  saveError?: string;
  onChange: (draft: WholesaleDraft) => void;
  onReset: () => void;
  onSave: () => void;
}

/**
 * Both languages of the page in tabs, saved together. Both panes stay mounted so unsaved text survives a tab
 * switch; a tab with an error is marked.
 */
export function WholesaleForm({
  dirty,
  draft,
  errors,
  onChange,
  onReset,
  onSave,
  saveError,
  saving,
}: WholesaleFormProps) {
  const [language, setLanguage] = useState<WholesaleLanguage>('uk');
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave();
  };

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit} spacing={3}>
      <Tabs
        aria-label="Мова сторінки"
        onChange={(_event, value: WholesaleLanguage) => setLanguage(value)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        value={language}
      >
        {wholesaleLanguages.map((code) => (
          <Tab
            aria-controls={`wholesale-text-${code}`}
            id={`wholesale-text-tab-${code}`}
            key={code}
            label={errors?.[code] ? `${languageLabels[code]} — є помилки` : languageLabels[code]}
            sx={errors?.[code] ? { color: 'error.main' } : undefined}
            value={code}
          />
        ))}
      </Tabs>
      {wholesaleLanguages.map((code) => (
        <Box
          aria-labelledby={`wholesale-text-tab-${code}`}
          hidden={code !== language}
          id={`wholesale-text-${code}`}
          key={code}
          role="tabpanel"
        >
          <WholesaleTextFields
            errors={errors?.[code]}
            onChange={(text) => onChange({ ...draft, [code]: text })}
            text={draft[code]}
          />
        </Box>
      ))}
      {saveError ? <Alert severity="error">{saveError}</Alert> : null}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          bgcolor: 'background.default',
          bottom: 0,
          justifyContent: 'flex-end',
          py: 1,
          position: 'sticky',
        }}
      >
        <Button disabled={!dirty || saving} onClick={onReset}>
          Скасувати зміни
        </Button>
        <Button disabled={!dirty || saving} type="submit" variant="contained">
          {saving ? 'Збереження…' : 'Зберегти'}
        </Button>
      </Stack>
    </Stack>
  );
}
