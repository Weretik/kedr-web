import { motion } from './motion';
import { darkColors, lightColors, type ColorRoles } from './palette';
import { radius, sizes, space } from './shape';
import { typeScale } from './typography';

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
