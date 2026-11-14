import { motion } from './tokens/motion';
import { darkColors, lightColors, type ColorRoles } from './tokens/palette';
import { radius, sizes, space } from './tokens/shape';
import { typeScale } from './tokens/typography';

const createTheme = (colors: ColorRoles) => ({
  colors,
  motion,
  radius,
  sizes,
  space,
  type: typeScale,
});

export const lightTheme = createTheme(lightColors);
export const darkTheme = createTheme(darkColors);

export type AppTheme = typeof lightTheme;
export type ThemeName = 'light' | 'dark';
