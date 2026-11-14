import {
  emptyHomeFaqTexts,
  homeAnswerMaxLength,
  homeFaqIssues,
  homeQuestionMaxLength,
} from '@admin/home-content/model';
import { AdminEditPanel, CountedTextField } from '@admin/shared/ui';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import type { HomeFaqTexts } from '@admin/home-content/model';

interface HomeFaqPanelProps {
  /** Texts of the question being edited; none for a new one. */
  initial?: HomeFaqTexts;
  saving: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (texts: HomeFaqTexts) => void;
}

const languages = [
  { label: 'Українською', question: 'questionUk', answer: 'answerUk' },
  { label: 'Російською', question: 'questionRu', answer: 'answerRu' },
] as const;

/** A question with its answer in both site languages. Mount it per question (key) so it starts from its texts. */
export function HomeFaqPanel({ error, initial, onCancel, onSave, saving }: HomeFaqPanelProps) {
  const [texts, setTexts] = useState(initial ?? emptyHomeFaqTexts);
  const [touched, setTouched] = useState(false);
  const issues = homeFaqIssues(texts);
  const valid = Object.keys(issues).length === 0;
  const shown = touched ? issues : {};

  return (
    <AdminEditPanel
      actions={
        <>
          <Button disabled={saving} onClick={onCancel}>
            Скасувати
          </Button>
          <Button
            disabled={saving}
            onClick={() => {
              setTouched(true);
              if (valid) onSave(texts);
            }}
            variant="contained"
          >
            {saving ? 'Збереження…' : 'Зберегти'}
          </Button>
        </>
      }
      busy={saving}
      onClose={onCancel}
      open
      subtitle={initial?.questionUk}
      title={initial ? 'Редагування питання' : 'Нове питання'}
    >
      <Stack spacing={2}>
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Box sx={{ display: 'grid', gap: 3 }}>
          {languages.map((language) => (
            <Box key={language.label} sx={{ alignContent: 'start', display: 'grid', gap: 2 }}>
              <Typography color="text.secondary" variant="overline">
                {language.label}
              </Typography>
              <CountedTextField
                error={shown[language.question]}
                label="Питання"
                maxLength={homeQuestionMaxLength}
                onChange={(value) => setTexts({ ...texts, [language.question]: value })}
                value={texts[language.question]}
              />
              <CountedTextField
                error={shown[language.answer]}
                label="Відповідь"
                maxLength={homeAnswerMaxLength}
                multiline
                onChange={(value) => setTexts({ ...texts, [language.answer]: value })}
                value={texts[language.answer]}
              />
            </Box>
          ))}
        </Box>
      </Stack>
    </AdminEditPanel>
  );
}
