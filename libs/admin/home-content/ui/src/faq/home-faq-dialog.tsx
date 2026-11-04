import {
  emptyHomeFaqTexts,
  homeAnswerMaxLength,
  homeFaqIssues,
  homeQuestionMaxLength,
} from '@admin/home-content/model';
import { CountedTextField } from '@admin/shared/ui';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { HomeFaqTexts } from '@admin/home-content/model';

interface HomeFaqDialogProps {
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
export function HomeFaqDialog({ error, initial, onCancel, onSave, saving }: HomeFaqDialogProps) {
  const [texts, setTexts] = useState(initial ?? emptyHomeFaqTexts);
  const [touched, setTouched] = useState(false);
  const issues = homeFaqIssues(texts);
  const valid = Object.keys(issues).length === 0;
  const shown = touched ? issues : {};

  return (
    <Dialog fullWidth maxWidth="md" onClose={saving ? undefined : onCancel} open>
      <DialogTitle>{initial ? 'Питання' : 'Нове питання'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
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
      </DialogContent>
      <DialogActions>
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
      </DialogActions>
    </Dialog>
  );
}
