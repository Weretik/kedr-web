import AutoModeOutlinedIcon from '@mui/icons-material/AutoModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import { useState } from 'react';

import type { MouseEvent } from 'react';

const colorSchemeItems = [
  { icon: <AutoModeOutlinedIcon fontSize="small" />, label: 'Системна', value: 'system' },
  { icon: <LightModeOutlinedIcon fontSize="small" />, label: 'Світла', value: 'light' },
  { icon: <DarkModeOutlinedIcon fontSize="small" />, label: 'Темна', value: 'dark' },
] as const;

export function ColorSchemeMenu() {
  const { mode, setMode } = useColorScheme();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorElement);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleModeChange = (nextMode: 'dark' | 'light' | 'system') => {
    setMode(nextMode);
    handleClose();
  };

  return (
    <>
      <Tooltip title="Тема оформлення">
        <IconButton
          aria-controls={isOpen ? 'color-scheme-menu' : undefined}
          aria-expanded={isOpen ? 'true' : undefined}
          aria-haspopup="menu"
          aria-label="Вибрати тему оформлення"
          onClick={handleOpen}
        >
          {mode === 'dark' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
        </IconButton>
      </Tooltip>
      <Menu anchorEl={anchorElement} id="color-scheme-menu" onClose={handleClose} open={isOpen}>
        {colorSchemeItems.map(({ icon, label, value }) => (
          <MenuItem key={value} onClick={() => handleModeChange(value)} selected={(mode ?? 'system') === value}>
            <ListItemIcon>{icon}</ListItemIcon>
            {label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
