import { SiteCategoryPicker } from '@admin/site-models/ui';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { Button, InputAdornment, Stack, TextField } from '@mui/material';

import type { useSiteModelsQueue } from '../../hooks/lists/use-site-models-queue';

interface SiteQueueToolbarProps {
  queue: ReturnType<typeof useSiteModelsQueue>;
  onHelp: () => void;
}

/** Category, search, and «Як це працює» above the «Нові моделі» queue. */
export function SiteQueueToolbar({ onHelp, queue }: SiteQueueToolbarProps) {
  const { categories, search, setSearch, state, update } = queue;
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
      <SiteCategoryPicker
        categories={categories.data ?? []}
        loading={categories.isLoading}
        onSelect={(categoryId) => update({ categoryId, item: undefined })}
        selectedId={state.categoryId}
      />
      <TextField
        aria-label="Пошук"
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Модель, товар або код 1С"
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
        sx={{ flex: '1 1 220px', maxWidth: 360 }}
        type="search"
        value={search}
      />
      <Button onClick={onHelp} startIcon={<HelpOutlineOutlinedIcon />}>
        Як це працює
      </Button>
    </Stack>
  );
}
