import { StyleSheet } from 'react-native-unistyles';

import { breakpoints } from './breakpoints';
import { darkTheme, lightTheme } from './themes';

const themes = { dark: darkTheme, light: lightTheme };

type AppBreakpoints = typeof breakpoints;
type AppThemes = typeof themes;

declare module 'react-native-unistyles' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesThemes extends AppThemes {}
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface UnistylesBreakpoints extends AppBreakpoints {}
}

// Runs once, when the library is first imported: the app entry imports it before Expo Router.
StyleSheet.configure({ breakpoints, settings: { adaptiveThemes: true }, themes });
