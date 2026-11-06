import { groupAttributesByRole } from '@admin/catalog-attributes/model';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  Alert,
  Box,
  Button,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import type { CatalogAttribute } from '@admin/catalog-attributes/model';

interface AttributeListProps {
  attributes: readonly CatalogAttribute[];
  selectedId: number | undefined;
  loading: boolean;
  error: boolean;
  onSelect: (id: number) => void;
  onRetry: () => void;
}

/** «Ознаки» on the left: grouped by what they do on the site, with a search; only an unused one is marked. */
export function AttributeList(props: AttributeListProps) {
  const [search, setSearch] = useState('');
  const groups = groupAttributesByRole(props.attributes, search);

  if (props.error)
    return (
      <Alert action={<Button onClick={props.onRetry}>Повторити</Button>} severity="error">
        Не вдалося завантажити ознаки.
      </Alert>
    );
  if (props.loading && props.attributes.length === 0)
    return <Skeleton aria-label="Завантаження ознак" height={320} variant="rounded" />;

  return (
    <Stack spacing={1}>
      <TextField
        aria-label="Знайти ознаку"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Знайти ознаку"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        type="search"
        value={search}
      />
      {groups.length === 0 ? (
        <Typography color="text.secondary" sx={{ p: 1 }} variant="body2">
          Нічого не знайдено.
        </Typography>
      ) : (
        <List aria-label="Ознаки" dense disablePadding>
          {groups.map((group) => (
            <Box component="li" key={group.role} sx={{ listStyle: 'none' }}>
              <Box component="ul" sx={{ p: 0 }}>
                <ListSubheader
                  disableSticky
                  sx={{
                    bgcolor: 'transparent',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    lineHeight: 2.4,
                    textTransform: 'uppercase',
                    typography: 'caption',
                  }}
                  title={group.hint}
                >
                  {group.title}
                </ListSubheader>
                {group.attributes.map((attribute) => {
                  const selected = attribute.id === props.selectedId;
                  return (
                    <ListItemButton
                      aria-current={selected ? 'true' : undefined}
                      key={attribute.id}
                      onClick={() => props.onSelect(attribute.id)}
                      selected={selected}
                      sx={{ borderRadius: 2, gap: 1 }}
                    >
                      <ListItemText
                        primary={attribute.nameUk}
                        slotProps={{
                          primary: {
                            sx: { fontWeight: selected ? 700 : 500, overflowWrap: 'anywhere' },
                          },
                        }}
                      />
                      <Typography
                        color="text.secondary"
                        sx={{ fontVariantNumeric: 'tabular-nums' }}
                        variant="caption"
                      >
                        {attribute.productCount.toLocaleString('uk-UA')}
                      </Typography>
                    </ListItemButton>
                  );
                })}
              </Box>
            </Box>
          ))}
        </List>
      )}
    </Stack>
  );
}
