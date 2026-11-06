import {
  Alert,
  Box,
  Button,
  List,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';

import type { UnresolvedCode } from '@admin/catalog-attributes/model';
import type { KeyboardEvent } from 'react';

interface CodeQueueListProps {
  codes: readonly UnresolvedCode[];
  selectedId: number | undefined;
  loading: boolean;
  error: boolean;
  onSelect: (aliasId: number) => void;
  onRetry: () => void;
}

/** The queue of «Не розшифровані коди»: the code, its attribute, and how many on-site products contain it. */
export function CodeQueueList(props: CodeQueueListProps) {
  const { codes, selectedId } = props;

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const index = codes.findIndex((code) => code.aliasId === selectedId);
    const next = codes[event.key === 'ArrowDown' ? index + 1 : Math.max(index - 1, 0)];
    if (next) props.onSelect(next.aliasId);
  };

  if (props.error)
    return (
      <Alert action={<Button onClick={props.onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити коди.
      </Alert>
    );
  if (props.loading && codes.length === 0)
    return <Skeleton aria-label="Завантаження кодів" height={320} variant="rounded" />;
  if (codes.length === 0)
    return (
      <Typography color="text.secondary" sx={{ p: 2 }} variant="body2">
        Нерозшифрованих кодів немає.
      </Typography>
    );

  return (
    <Stack spacing={1}>
      <Typography
        color="text.secondary"
        sx={{ fontWeight: 700, letterSpacing: '0.06em', px: 1, textTransform: 'uppercase' }}
        variant="caption"
      >
        Черга · {codes.length}
      </Typography>
      <List aria-label="Черга кодів" dense disablePadding onKeyDown={onKeyDown}>
        {codes.map((code) => {
          const selected = code.aliasId === selectedId;
          return (
            <ListItemButton
              aria-current={selected ? 'true' : undefined}
              key={code.aliasId}
              onClick={() => props.onSelect(code.aliasId)}
              selected={selected}
              sx={{ borderRadius: 2, gap: 1.5, py: 1 }}
            >
              <Box
                component="span"
                sx={{
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1.5,
                  flex: '0 0 auto',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  px: 0.75,
                }}
              >
                {code.rawValue}
              </Box>
              <ListItemText
                primary={code.attributeName}
                slotProps={{
                  primary: { sx: { fontWeight: selected ? 700 : 500, overflowWrap: 'anywhere' } },
                }}
              />
              <Typography
                color="text.secondary"
                sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}
                variant="body2"
              >
                {code.productCount}
              </Typography>
            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
}
