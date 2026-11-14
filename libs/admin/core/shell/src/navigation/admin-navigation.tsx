import { Box, Collapse } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import { NavigationGroupButton } from './navigation-group-button';
import {
  isItemActive,
  navigationGroups,
  overviewItem,
  type NavigationGroup,
  type NavigationItem,
} from './navigation-groups';
import { NavigationLink } from './navigation-link';
import { sidebarColors } from './sidebar-colors';
import { useAdminShellUser } from '../providers/admin-shell-session-provider';

export const adminDrawerWidth = 264;
export const adminDrawerCollapsedWidth = 84;

interface AdminNavigationProps {
  /** Optional counter per block id (for example new orders); shown only when above zero. */
  groupCounts?: Record<string, number>;
  isCollapsed?: boolean;
  onNavigate?: () => void;
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
            <NavigationGroupButton
              count={count}
              group={group}
              hasActivePage={hasActivePage}
              isOpen={isOpen}
              onToggle={() => toggleGroup(group.id)}
              panelId={panelId}
            />
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
