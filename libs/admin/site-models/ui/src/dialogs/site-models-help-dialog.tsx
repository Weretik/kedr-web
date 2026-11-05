import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';

const steps: readonly [string, string][] = [
  [
    'Модель — це одна сторінка на сайті',
    'Вона об’єднує товари однієї кінцевої категорії, які відрізняються лише кольором, розміром чи стороною.',
  ],
  [
    'Автоматика пропонує, людина вирішує',
    'Після кожної синхронізації з 1С система пропонує моделі. Прийнята модель більше не змінюється автоматично.',
  ],
  [
    'Ознаки — це перемикачі',
    'Покупець вибирає значення ознак на сторінці моделі. Кожен товар моделі повинен мати своє, неповторне поєднання.',
  ],
  [
    'Товар без моделі — помилка',
    'Товар на сайті поза прийнятою моделлю не має своєї сторінки. «Огляд» показує їх червоним.',
  ],
];

/** «Як це працює» on the «Моделі» page. */
export function SiteModelsHelpDialog({ onClose }: { onClose: () => void }) {
  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open>
      <DialogTitle>Як працюють моделі</DialogTitle>
      <DialogContent>
        <Stack component="ol" spacing={2} sx={{ m: 0, pl: 2.5 }}>
          {steps.map(([title, text]) => (
            <li key={title}>
              <Typography sx={{ fontWeight: 600 }} variant="body2">
                {title}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {text}
              </Typography>
            </li>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Зрозуміло</Button>
      </DialogActions>
    </Dialog>
  );
}
