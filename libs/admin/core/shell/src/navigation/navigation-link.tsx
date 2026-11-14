import { Box, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { isItemActive, type NavigationItem } from './navigation-groups';
import { sidebarColors } from './sidebar-colors';

interface NavigationLinkProps {
  isCollapsed: boolean;
  isNested?: boolean;
  item: NavigationItem;
  onNavigate?: () => void;
  pathname: string;
}

/** One sidebar link; a nested link shows a dot instead of an icon. */
export function NavigationLink({
  isCollapsed,
  isNested,
  item,
  onNavigate,
  pathname,
}: NavigationLinkProps) {
  const { icon, label, to } = item;
  const isActive = isItemActive(pathname, to);

  return (
    <Box component="li">
      <Tooltip
        disableFocusListener={!isCollapsed}
        disableHoverListener={!isCollapsed}
        disableTouchListener
        placement="right"
        title={label}
      >
        <Box
          component={RouterLink}
          aria-current={isActive ? 'page' : undefined}
          aria-label={isCollapsed ? label : undefined}
          onClick={onNavigate}
          sx={(theme) => ({
            alignItems: 'center',
            bgcolor: isActive && !isNested ? sidebarColors.activeBackground : 'transparent',
            borderRadius: '12px',
            position: 'relative',
            color: isActive ? sidebarColors.activeText : sidebarColors.text,
            display: 'flex',
            gap: 1.5,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            minHeight: isNested ? 36 : 44,
            pl: isCollapsed ? 0 : isNested ? 4 : 1.5,
            pr: isCollapsed ? 0 : 1.5,
            textDecoration: 'none',
            transition: theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.shorter,
            }),
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: isActive && !isNested ? sidebarColors.activeBackground : sidebarColors.hover,
              color: isActive ? sidebarColors.activeText : sidebarColors.textStrong,
            },
            '&:focus-visible': {
              outline: '2px solid',
              outlineColor: sidebarColors.focus,
              outlineOffset: 2,
            },
          })}
          to={to}
        >
          {isNested ? (
            <Box
              aria-hidden
              sx={{
                bgcolor: isActive ? sidebarColors.accent : sidebarColors.border,
                borderRadius: '50%',
                boxShadow: isActive ? `0 0 0 3px ${sidebarColors.activeBackground}` : 'none',
                height: 6,
                left: 14,
                position: 'absolute',
                top: '50%',
                transform: 'translateY(-50%)',
                width: 6,
              }}
            />
          ) : (
            <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>{icon}</Box>
          )}
          {isCollapsed ? null : (
            <Typography
              component="span"
              sx={{
                color: 'inherit',
                fontSize: '0.875rem',
                fontWeight: isNested ? 600 : 700,
              }}
            >
              {label}
            </Typography>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}
