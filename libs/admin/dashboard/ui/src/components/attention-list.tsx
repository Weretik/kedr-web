import { SectionCard } from '@admin/shared/ui';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import HideImageOutlinedIcon from '@mui/icons-material/HideImageOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import LabelOffOutlinedIcon from '@mui/icons-material/LabelOffOutlined';
import RuleOutlinedIcon from '@mui/icons-material/RuleOutlined';
import SyncProblemOutlinedIcon from '@mui/icons-material/SyncProblemOutlined';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';

import type { AttentionItem, AttentionKind, AttentionTone } from '@admin/dashboard/model';
import type { ReactNode } from 'react';

/** Rows shown in full; the rest become short links under them. */
const mainRows = 4;

const icons: Record<AttentionKind, ReactNode> = {
  sync: <SyncProblemOutlinedIcon />,
  photos: <HideImageOutlinedIcon />,
  'attribute-problems': <RuleOutlinedIcon />,
  'no-name': <LabelOffOutlinedIcon />,
  'category-texts': <AccountTreeOutlinedIcon />,
  'article-drafts': <ArticleOutlinedIcon />,
  'legacy-covers': <ImageOutlinedIcon />,
  'document-drafts': <GavelOutlinedIcon />,
};

const toneColor: Record<AttentionTone, string> = {
  error: 'error',
  warning: 'warning',
  note: 'text.secondary',
};

/** «Потребує уваги»: problems most urgent first. Renders nothing when there are none. */
export function AttentionList({ items }: { items: readonly AttentionItem[] }) {
  if (items.length === 0) return null;
  const rows = items.slice(0, mainRows);
  const more = items.slice(mainRows);

  return (
    <SectionCard title="Потребує уваги">
      <Stack component="ul" spacing={1.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {rows.map((item) => (
          <Box
            component="li"
            key={item.kind}
            sx={{
              alignItems: 'center',
              bgcolor: item.tone === 'note' ? 'action.hover' : `${item.tone}.light`,
              borderRadius: 3,
              display: 'flex',
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
              gap: 2,
              p: 2,
            }}
          >
            <Box
              aria-hidden="true"
              sx={{
                alignItems: 'center',
                bgcolor: 'background.paper',
                borderRadius: 2.5,
                color: toneColor[item.tone],
                display: 'flex',
                flex: '0 0 auto',
                height: 44,
                justifyContent: 'center',
                width: 44,
              }}
            >
              {icons[item.kind]}
            </Box>
            <Stack spacing={0.25} sx={{ flex: '1 1 220px', minWidth: 0 }}>
              <Typography component="p" sx={{ fontWeight: 700 }} variant="body1">
                {item.title}
              </Typography>
              {item.detail ? (
                <Typography
                  color="text.secondary"
                  sx={{ overflowWrap: 'anywhere' }}
                  variant="body2"
                >
                  {item.detail}
                </Typography>
              ) : null}
            </Stack>
            <Button
              aria-label={item.actionLabel}
              color={item.tone === 'error' ? 'error' : 'primary'}
              href={item.href}
              sx={{ flex: '0 0 auto', minHeight: 44 }}
            >
              Відкрити
            </Button>
          </Box>
        ))}
      </Stack>
      {more.length > 0 ? (
        <Stack direction="row" sx={{ alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Typography color="text.secondary" variant="body2">
            Ще:
          </Typography>
          {more.map((item) => (
            <Chip clickable component="a" href={item.href} key={item.kind} label={item.title} />
          ))}
        </Stack>
      ) : null}
    </SectionCard>
  );
}
