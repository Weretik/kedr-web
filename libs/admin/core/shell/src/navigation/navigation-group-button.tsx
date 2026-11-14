import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Typography } from '@mui/material';

import { sidebarColors } from './sidebar-colors';

import type { NavigationGroup } from './navigation-groups';

interface NavigationGroupButtonProps {
  group: NavigationGroup;
  isOpen: boolean;
  /** Counter shown when above zero (for example new orders). */
  count: number;
  /** The block holds the current page. */
  hasActivePage: boolean;
  panelId: string;
  onToggle: () => void;
}

/** The heading of a sidebar block that opens and closes its links. */
export function NavigationGroupButton({
  count,
  group,
  hasActivePage,
  isOpen,
  onToggle,
  panelId,
}: NavigationGroupButtonProps) {
  return (
    <Box
      aria-controls={panelId}
      aria-expanded={isOpen}
      component="button"
      onClick={onToggle}
      sx={(theme) => ({
        alignItems: 'center',
        bgcolor: isOpen ? sidebarColors.hover : 'transparent',
        border: 0,
        borderRadius: '12px',
        color: isOpen ? sidebarColors.textStrong : sidebarColors.text,
        cursor: 'pointer',
        display: 'flex',
        font: 'inherit',
        gap: 1.5,
        minHeight: 44,
        px: 1.5,
        textAlign: 'left',
        transition: theme.transitions.create(['background-color', 'color'], {
          duration: theme.transitions.duration.shorter,
        }),
        width: '100%',
        '&:hover': { bgcolor: sidebarColors.hover, color: sidebarColors.textStrong },
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: sidebarColors.focus,
          outlineOffset: 2,
        },
      })}
      type="button"
    >
      <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>{group.icon}</Box>
      <Typography
        component="span"
        sx={{ color: 'inherit', flex: 1, fontSize: '0.875rem', fontWeight: 700 }}
      >
        {group.label}
      </Typography>
      {count > 0 ? (
        <Typography
          component="span"
          sx={{
            bgcolor: sidebarColors.activeBackground,
            borderRadius: 999,
            color: sidebarColors.activeText,
            fontWeight: 800,
            px: 0.875,
          }}
          variant="caption"
        >
          {count}
        </Typography>
      ) : null}
      {/* The block holds the current page but is closed: keep the user oriented. */}
      {hasActivePage && !isOpen ? (
        <Box
          aria-label="Тут поточна сторінка"
          role="img"
          sx={{ bgcolor: sidebarColors.accent, borderRadius: '50%', height: 6, width: 6 }}
        />
      ) : null}
      <ExpandMoreIcon
        fontSize="small"
        sx={(theme) => ({
          transform: isOpen ? 'none' : 'rotate(-90deg)',
          transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shorter,
          }),
        })}
      />
    </Box>
  );
}
