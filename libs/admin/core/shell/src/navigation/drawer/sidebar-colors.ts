/**
 * The navigation drawer is dark in both color schemes by design decision, so its colors are
 * fixed here instead of coming from the light/dark palette. Brand green stays the accent.
 */
export const sidebarColors = {
  background: '#141713',
  border: '#262B24',
  text: '#A9B0A5',
  textStrong: '#EEF0EA',
  hover: 'rgba(238, 240, 234, 0.06)',
  activeBackground: 'rgba(63, 164, 53, 0.2)',
  activeText: '#8FD684',
  accent: '#3FA435',
  scrollbarThumb: '#3A4138',
  scrollbarThumbHover: '#4B5547',
  focus: '#8FD684',
} as const;
