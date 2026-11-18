import type { TypographyVariantsOptions } from '@mui/material/styles';

export const adminFontFamily = 'Manrope, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const adminTypography = {
  fontFamily: adminFontFamily,
  fontSize: 14,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 800,
  h1: { fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
  h2: { fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 },
  h3: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 },
  h4: { fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.015em', lineHeight: 1.25 },
  h5: { fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.3 },
  h6: { fontSize: '1.125rem', fontWeight: 800, lineHeight: 1.35 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.57 },
  button: { fontWeight: 700, letterSpacing: 0, textTransform: 'none' },
  caption: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.66 },
  overline: {
    fontSize: '0.6875rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
    lineHeight: 2.2,
    textTransform: 'uppercase',
  },
  subtitle1: { fontSize: '1rem', fontWeight: 700, lineHeight: 1.5 },
  subtitle2: { fontSize: '0.875rem', fontWeight: 700, lineHeight: 1.57 },
} satisfies TypographyVariantsOptions;
