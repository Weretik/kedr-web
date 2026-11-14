import { StatusPill } from '@admin/shared/ui';
import { siteModelAllProblems } from '@admin/site-models/model';
import { SiteModelNameForm, SiteProblemPills } from '@admin/site-models/ui';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Alert, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState } from 'react';

import type { useSiteModelEditor } from '../../hooks/use-site-model-editor';
import type { SiteModel } from '@admin/site-models/model';

export type PaneTab = 'products' | 'texts';

interface SiteModelHeaderProps {
  model: SiteModel;
  editor: ReturnType<typeof useSiteModelEditor>;
  tab: PaneTab;
  onTabChange: (tab: PaneTab) => void;
}

/** Category and address, the name with «Перейменувати», problems, and the section tabs. */
export function SiteModelHeader({ editor, model, onTabChange, tab }: SiteModelHeaderProps) {
  const [renaming, setRenaming] = useState(false);
  const problems = siteModelAllProblems(model);
  const proposed = model.status === 'proposed';
  const setTab = onTabChange;

  return (
    <Stack spacing={1.5} sx={{ px: { xs: 2, md: 3 }, pt: 2.5 }}>
      <Typography color="text.secondary" variant="body2">
        {model.categoryName} · /{model.slug}
      </Typography>
      {renaming ? (
        <SiteModelNameForm
          error={editor.errors.header ?? null}
          helperText="Адреса сторінки на сайті не зміниться."
          initialName={model.name}
          onCancel={() => setRenaming(false)}
          onSubmit={(name) =>
            void editor.rename(model.id, name).then((ok) => ok && setRenaming(false))
          }
          saving={editor.renaming}
          submitLabel="Зберегти назву"
        />
      ) : (
        <Stack
          direction="row"
          spacing={1.5}
          sx={{ alignItems: 'center', flexWrap: 'wrap' }}
          useFlexGap
        >
          <Typography component="h2" sx={{ overflowWrap: 'anywhere' }} variant="h5">
            {model.name}
          </Typography>
          {proposed ? <StatusPill label="Не перевірена" tone="info" /> : null}
          <Button
            onClick={() => {
              editor.clearError('header');
              setRenaming(true);
            }}
            size="small"
            startIcon={<EditOutlinedIcon />}
          >
            Перейменувати
          </Button>
        </Stack>
      )}
      {problems.length > 0 ? <SiteProblemPills problems={problems} /> : null}
      {editor.errors.header && !renaming ? (
        <Alert severity="error">{editor.errors.header}</Alert>
      ) : null}
      <Tabs
        aria-label="Розділ моделі"
        onChange={(_event, value: PaneTab) => setTab(value)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        value={tab}
      >
        <Tab label="Товари й ознаки" value="products" />
        <Tab label="SEO та опис" value="texts" />
      </Tabs>
    </Stack>
  );
}
