import KeyboardDoubleArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftOutlined';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { AdminNavigation } from '../navigation/admin-navigation';
import { sidebarColors } from '../navigation/sidebar-colors';
import { useAdminShellUser } from '../providers/admin-shell-session-provider';

interface AdminSidebarProps {
  currentOrderPositionCount: number;
  isCollapsed?: boolean;
  onNavigate?: () => void;
  /** Shown only for the desktop drawer, which can be collapsed to icons. */
  onToggleCollapsed?: () => void;
}

function AdminLogo({ isCollapsed }: { isCollapsed: boolean }) {
  const height = 44;

  if (isCollapsed)
    return (
      <Box
        alt="Логотип Class Kedr"
        component="img"
        src="/assets/logo/kedr-emblem.svg"
        sx={{ borderRadius: '10px', display: 'block', height: 40, width: 40 }}
      />
    );

  // The drawer is dark in both color schemes, so only the on-dark logo is used.
  return (
    <Box
      alt="Логотип Class Kedr"
      component="img"
      src="/assets/logo/main-logo-on-dark.svg"
      sx={{ display: 'block', height, width: 'auto' }}
    />
  );
}

export function AdminSidebar({
  currentOrderPositionCount,
  isCollapsed = false,
  onNavigate,
  onToggleCollapsed,
}: AdminSidebarProps) {
  const toggleLabel = isCollapsed ? 'Розгорнути меню' : 'Згорнути меню';
  const roleBadge = useAdminShellUser()?.roleBadge ?? 'Admin';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        height: '100%',
        overflowX: 'hidden',
        py: 3,
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          gap: 1,
          justifyContent: isCollapsed ? 'center' : 'space-between',
          minHeight: 48,
          px: isCollapsed ? 0 : 3,
        }}
      >
        <AdminLogo isCollapsed={isCollapsed} />
        {isCollapsed ? null : (
          <Typography
            component="span"
            sx={{
              border: 1,
              borderColor: sidebarColors.border,
              borderRadius: '6px',
              color: sidebarColors.text,
              lineHeight: 1.6,
              px: 0.75,
            }}
            variant="overline"
          >
            {roleBadge}
          </Typography>
        )}
      </Box>

      <AdminNavigation isCollapsed={isCollapsed} onNavigate={onNavigate} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 'auto', px: 2 }}>
        {isCollapsed ? null : (
          <Box
            sx={{
              bgcolor: sidebarColors.hover,
              border: 1,
              borderColor: sidebarColors.border,
              borderRadius: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              p: 2,
            }}
          >
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                gap: 1,
                justifyContent: 'space-between',
              }}
            >
              <Typography
                component="span"
                sx={{ color: sidebarColors.activeText }}
                variant="subtitle2"
              >
                Поточне замовлення
              </Typography>
              <Typography
                component="span"
                sx={{ color: sidebarColors.text, fontWeight: 700 }}
                variant="caption"
              >
                позицій: {currentOrderPositionCount}
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              fullWidth
              onClick={onNavigate}
              to="/orders/new"
              variant="contained"
            >
              Оформити
            </Button>
          </Box>
        )}
        {onToggleCollapsed ? (
          <Tooltip disableHoverListener={!isCollapsed} placement="right" title={toggleLabel}>
            <Button
              aria-expanded={!isCollapsed}
              aria-label={isCollapsed ? toggleLabel : undefined}
              color="inherit"
              onClick={onToggleCollapsed}
              startIcon={
                <KeyboardDoubleArrowLeftOutlinedIcon
                  sx={(theme) => ({
                    transform: isCollapsed ? 'scaleX(-1)' : 'none',
                    transition: theme.transitions.create('transform'),
                  })}
                />
              }
              sx={{
                color: sidebarColors.text,
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                minWidth: 0,
                px: 1.5,
                '&:hover': { bgcolor: sidebarColors.hover, color: sidebarColors.textStrong },
                '& .MuiButton-startIcon': { m: isCollapsed ? 0 : undefined },
              }}
            >
              {isCollapsed ? null : toggleLabel}
            </Button>
          </Tooltip>
        ) : null}
      </Box>
    </Box>
  );
}
