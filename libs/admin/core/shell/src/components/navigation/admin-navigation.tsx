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
  /** Optional counter per block id (for example new orders); shown only when above zero. */
  groupCounts?: Record<string, number>;
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

const listSx = {
  display: 'flex',
  flexDirection: 'column',
  gap: 0.5,
  listStyle: 'none',
  m: 0,
  p: 0,
} as const;

export function AdminNavigation({
  groupCounts = {},
  isCollapsed = false,
  onNavigate,
}: AdminNavigationProps) {
  const { pathname } = useLocation();
  const user = useAdminShellUser();
  const isAllowed = (item: NavigationItem) =>
    item.access === undefined ||
    (item.access === 'admin' ? user?.isAdmin === true : user?.canManageUsers === true);

  // A block with no items for this role (for example «Система» for a manager) is hidden.
  const groups = navigationGroups
    .map((group): NavigationGroup => ({
      ...group,
      items: group.items.filter(isAllowed),
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
        const count = groupCounts[group.id] ?? 0;
        const hasActivePage = group.id === activeGroupId;

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
              <Box sx={{ alignItems: 'center', display: 'flex', flex: '0 0 auto' }}>
                {group.icon}
              </Box>
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
            <Collapse id={panelId} in={isOpen} unmountOnExit>
              <Box component="ul" sx={{ ...listSx, gap: 0.125, pb: 0.5, pl: 1.5, pt: 0.5 }}>
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
