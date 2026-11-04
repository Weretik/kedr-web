import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Box, Drawer, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useId } from 'react';

import type { ReactNode } from 'react';

interface AdminEditPanelProps {
  open: boolean;
  /** What is edited, for example «Редагування категорії». */
  title: string;
  /** The entity name, so the panel says which row it edits. */
  subtitle?: ReactNode;
  /** While a save runs the panel cannot be closed. */
  busy?: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * The one place where an entity is edited: a panel on the right over the list or the detail page.
 * Sections inside save on their own; the page behind stays read-only.
 */
export function AdminEditPanel({
  busy = false,
  children,
  onClose,
  open,
  subtitle,
  title,
}: AdminEditPanelProps) {
  const titleId = useId();

  return (
    <Drawer
      anchor="right"
      onClose={busy ? undefined : onClose}
      open={open}
      slotProps={{
        paper: {
          'aria-labelledby': titleId,
          role: 'dialog',
          sx: { bgcolor: 'background.default', width: { xs: '100%', sm: 560, lg: 640 } },
        },
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'flex-start',
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          justifyContent: 'space-between',
          position: 'sticky',
          px: 3,
          py: 2,
          top: 0,
          zIndex: 1,
        }}
      >
        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
          <Typography component="h2" id={titleId} variant="h6">
            {title}
          </Typography>
          {subtitle ? (
            <Typography color="text.secondary" sx={{ overflowWrap: 'anywhere' }} variant="body2">
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
        <Tooltip title="Закрити">
          <span>
            <IconButton aria-label="Закрити панель" disabled={busy} onClick={onClose}>
              <CloseOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>
      <Box sx={{ display: 'grid', gap: 2, p: { xs: 2, sm: 3 } }}>{children}</Box>
    </Drawer>
  );
}
