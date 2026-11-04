import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';

import {
  isItemActive,
  navigationGroups,
  overviewItem,
  type NavigationGroup,
  type NavigationItem,
} from './navigation-groups';
import { sidebarColors } from './sidebar-colors';
import { useAdminShellUser } from '../../providers/admin-shell-session-provider';

export const adminDrawerWidth = 264;
export const adminDrawerCollapsedWidth = 84;

interface AdminNavigationProps {
  isCollapsed?: boolean;
  onNavigate?: () => void;
}

interface NavigationLinkProps {
  isCollapsed: boolean;
  isNested?: boolean;
  item: NavigationItem;
  onNavigate?: () => void;
  pathname: string;
}

function NavigationLink({
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
            bgcolor: isActive ? sidebarColors.activeBackground : 'transparent',
            borderRadius: '12px',
            color: isActive ? sidebarColors.activeText : sidebarColors.text,
            display: 'flex',
            gap: 1.5,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            minHeight: isNested ? 40 : 44,
            px: isCollapsed ? 0 : 1.5,
            textDecoration: 'none',
            transition: theme.transitions.create(['background-color', 'color'], {
              duration: theme.transitions.duration.shorter,
            }),
            whiteSpace: 'nowrap',
            '&:hover': {
              bgcolor: isActive ? sidebarColors.activeBackground : sidebarColors.hover,
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
          <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>{icon}</Box>
          {isCollapsed ? null : (
            <Typography
              component="span"
              sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 700 }}
            >
              {label}
            </Typography>
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}

const listSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  listStyle: 'none',
  m: 0,
  p: 0,
} as const;

export function AdminNavigation({ isCollapsed = false, onNavigate }: AdminNavigationProps) {
  const { pathname } = useLocation();
  const user = useAdminShellUser();
  const canManageUsers = user?.canManageUsers === true;

  // A block with no items for this role (for example «Система» for a manager) is hidden.
  const groups = navigationGroups
    .map((group): NavigationGroup => ({
      ...group,
      items: group.items.filter((item) => !item.adminOnly || canManageUsers),
    }))
    .filter((group) => group.items.length > 0);

  const activeGroupId = groups.find((group) =>
    group.items.some((item) => isItemActive(pathname, item.to)),
  )?.id;
  const [openGroupIds, setOpenGroupIds] = useState<string[]>(activeGroupId ? [activeGroupId] : []);

  // Navigating into a block (link, back button) opens it; other blocks keep the user's choice.
  const [seenActiveGroupId, setSeenActiveGroupId] = useState(activeGroupId);
  if (seenActiveGroupId !== activeGroupId) {
    setSeenActiveGroupId(activeGroupId);
    if (activeGroupId && !openGroupIds.includes(activeGroupId))
      setOpenGroupIds([...openGroupIds, activeGroupId]);
  }

  const toggleGroup = (id: string) => {
    setOpenGroupIds((ids) =>
      ids.includes(id) ? ids.filter((value) => value !== id) : [...ids, id],
    );
  };

  const linkProps = { isCollapsed, onNavigate, pathname };

  return (
    <Box aria-label="Основна навігація" component="nav" sx={{ px: 2 }}>
      <Box component="ul" sx={listSx}>
        <NavigationLink item={overviewItem} {...linkProps} />
      </Box>

      {groups.map((group) => {
        const isOpen = openGroupIds.includes(group.id);
        const panelId = `admin-navigation-${group.id}`;

        // Collapsed to icons: no headings, blocks are separated by a thin line.
        if (isCollapsed)
          return (
            <Box
              component="ul"
              key={group.id}
              sx={{ ...listSx, borderTop: 1, borderColor: sidebarColors.border, mt: 1.5, pt: 1.5 }}
            >
              {group.items.map((item) => (
                <NavigationLink item={item} key={item.to} {...linkProps} />
              ))}
            </Box>
          );

        return (
          <Box key={group.id} sx={{ mt: 1.5 }}>
            <Box
              aria-controls={panelId}
              aria-expanded={isOpen}
              component="button"
              onClick={() => {
                toggleGroup(group.id);
              }}
              sx={(theme) => ({
                alignItems: 'center',
                bgcolor: 'transparent',
                border: 0,
                borderRadius: '12px',
                color: isOpen ? sidebarColors.textStrong : sidebarColors.groupLabel,
                cursor: 'pointer',
                display: 'flex',
                font: 'inherit',
                justifyContent: 'space-between',
                minHeight: 40,
                px: 1.5,
                textAlign: 'left',
                transition: theme.transitions.create('color', {
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
              <Typography
                component="span"
                sx={{ color: 'inherit', fontWeight: 800, letterSpacing: '0.08em' }}
                variant="overline"
              >
                {group.label}
              </Typography>
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
            <Collapse id={panelId} in={isOpen} unmountOnExit>
              <Box component="ul" sx={{ ...listSx, pt: 0.5 }}>
                {group.items.map((item) => (
                  <NavigationLink isNested item={item} key={item.to} {...linkProps} />
                ))}
              </Box>
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
}
