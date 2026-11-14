import { Box } from '@mui/material';

/** The Kedr mark and name at the top of the sidebar; only the mark when collapsed. */
export function AdminLogo({ isCollapsed }: { isCollapsed: boolean }) {
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
