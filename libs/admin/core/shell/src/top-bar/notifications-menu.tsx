import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { Box, IconButton, Menu, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';

import type { MouseEvent } from 'react';

export function NotificationsMenu() {
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  return (
    <>
      <Tooltip title="Сповіщення">
        <IconButton
          aria-controls={isOpen ? 'notifications-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="Відкрити сповіщення"
          onClick={handleOpen}
        >
          <NotificationsNoneIcon />
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorElement} id="notifications-menu" onClose={handleClose} open={isOpen}>
        <Box sx={{ px: 3, py: 2 }}>
          <Typography variant="subtitle2">Сповіщень немає</Typography>
        </Box>
      </Menu>
    </>
  );
}
