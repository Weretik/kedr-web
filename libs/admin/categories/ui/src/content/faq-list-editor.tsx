import { categoryContentLimits } from '@admin/categories/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Alert, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { CountedTextField } from './counted-text-field';

import type { CategoryContentErrors, CategoryFaqItem } from '@admin/categories/model';

interface FaqListEditorProps {
  items: readonly CategoryFaqItem[];
  onChange: (items: CategoryFaqItem[]) => void;
  errors?: Pick<CategoryContentErrors, 'faq' | 'faqItems'>;
}

const move = (items: readonly CategoryFaqItem[], from: number, to: number) => {
  const next = [...items];
  const [item] = next.splice(from, 1);
  if (item) next.splice(to, 0, item);
  return next;
};

/** Ordered question and answer pairs: add, edit, move, and remove. */
export function FaqListEditor({ errors, items, onChange }: FaqListEditorProps) {
  const limits = categoryContentLimits;
  const update = (index: number, patch: Partial<CategoryFaqItem>) =>
    onChange(items.map((item, position) => (position === index ? { ...item, ...patch } : item)));

  return (
    <Stack spacing={2}>
      {items.length === 0 ? (
        <Typography color="text.secondary" variant="body2">
          Питань ще немає.
        </Typography>
      ) : null}
      {items.map((item, index) => {
        const number = index + 1;
        const itemErrors = errors?.faqItems?.[index];
        return (
          <Box
            aria-label={`Питання ${number}`}
            component="fieldset"
            key={index}
            sx={{ border: 1, borderColor: 'divider', borderRadius: 2, m: 0, p: 2 }}
          >
            <Stack spacing={2}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography component="span" sx={{ fontWeight: 700 }} variant="body2">
                  Питання {number}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Tooltip title="Вище">
                    <span>
                      <IconButton
                        aria-label={`Перемістити питання ${number} вище`}
                        disabled={index === 0}
                        onClick={() => onChange(move(items, index, index - 1))}
                        size="small"
                      >
                        <ArrowUpwardOutlinedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Нижче">
                    <span>
                      <IconButton
                        aria-label={`Перемістити питання ${number} нижче`}
                        disabled={index === items.length - 1}
                        onClick={() => onChange(move(items, index, index + 1))}
                        size="small"
                      >
                        <ArrowDownwardOutlinedIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title="Видалити">
                    <IconButton
                      aria-label={`Видалити питання ${number}`}
                      onClick={() =>
                        onChange(items.filter((_item, position) => position !== index))
                      }
                      size="small"
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <CountedTextField
                error={itemErrors?.question}
                label="Питання"
                maxLength={limits.faqQuestion}
                onChange={(question) => update(index, { question })}
                value={item.question}
              />
              <CountedTextField
                error={itemErrors?.answer}
                label="Відповідь"
                maxLength={limits.faqAnswer}
                multiline
                onChange={(answer) => update(index, { answer })}
                value={item.answer}
              />
            </Stack>
          </Box>
        );
      })}
      {errors?.faq ? <Alert severity="error">{errors.faq}</Alert> : null}
      <Box>
        <Button
          disabled={items.length >= limits.faqItems}
          onClick={() => onChange([...items, { answer: '', question: '' }])}
          startIcon={<AddOutlinedIcon />}
          variant="outlined"
        >
          Додати питання
        </Button>
      </Box>
    </Stack>
  );
}
