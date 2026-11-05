import { CountedTextField } from '@admin/shared/ui';
import { moveFaqItem, wholesaleLimits } from '@admin/wholesale-content/model';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import ArrowDownwardOutlinedIcon from '@mui/icons-material/ArrowDownwardOutlined';
import ArrowUpwardOutlinedIcon from '@mui/icons-material/ArrowUpwardOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Alert, Box, Button, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import type { WholesaleFaqItem, WholesaleTextErrors } from '@admin/wholesale-content/model';

interface WholesaleFaqEditorProps {
  items: WholesaleFaqItem[];
  errors?: WholesaleTextErrors['faq'];
  countError?: string;
  onChange: (items: WholesaleFaqItem[]) => void;
}

/** Questions for wholesale buyers in the site order: add, remove, move up or down. */
export function WholesaleFaqEditor({
  countError,
  errors,
  items,
  onChange,
}: WholesaleFaqEditorProps) {
  const set = (index: number, patch: Partial<WholesaleFaqItem>) =>
    onChange(items.map((item, position) => (position === index ? { ...item, ...patch } : item)));

  return (
    <Stack spacing={2}>
      {countError ? <Alert severity="error">{countError}</Alert> : null}
      {items.map((item, index) => (
        <Box key={index} sx={{ border: 1, borderColor: 'divider', borderRadius: 1, p: 2 }}>
          <Stack direction="row" sx={{ alignItems: 'center', mb: 1.5 }}>
            <Typography sx={{ flex: 1, fontWeight: 600 }} variant="body2">
              {`Питання ${index + 1}`}
            </Typography>
            <Tooltip title="Вище">
              <span>
                <IconButton
                  aria-label={`Перемістити питання ${index + 1} вище`}
                  disabled={index === 0}
                  onClick={() => onChange(moveFaqItem(items, index, -1))}
                  size="small"
                >
                  <ArrowUpwardOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Нижче">
              <span>
                <IconButton
                  aria-label={`Перемістити питання ${index + 1} нижче`}
                  disabled={index === items.length - 1}
                  onClick={() => onChange(moveFaqItem(items, index, 1))}
                  size="small"
                >
                  <ArrowDownwardOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Прибрати">
              <span>
                <IconButton
                  aria-label={`Прибрати питання ${index + 1}`}
                  disabled={items.length === 1}
                  onClick={() => onChange(items.filter((_item, position) => position !== index))}
                  size="small"
                >
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
          <Stack spacing={2}>
            <CountedTextField
              error={errors?.[index]?.question}
              label="Питання"
              maxLength={wholesaleLimits.question}
              onChange={(question) => set(index, { question })}
              value={item.question}
            />
            <CountedTextField
              error={errors?.[index]?.answer}
              label="Відповідь"
              maxLength={wholesaleLimits.answer}
              multiline
              onChange={(answer) => set(index, { answer })}
              value={item.answer}
            />
          </Stack>
        </Box>
      ))}
      <Box>
        <Button
          disabled={items.length >= wholesaleLimits.maxFaq}
          onClick={() => onChange([...items, { question: '', answer: '' }])}
          startIcon={<AddOutlinedIcon />}
        >
          Додати питання
        </Button>
      </Box>
    </Stack>
  );
}
