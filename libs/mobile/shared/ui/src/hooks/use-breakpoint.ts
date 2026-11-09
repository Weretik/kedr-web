import { useWindowDimensions } from 'react-native';

import { breakpointFor, type Breakpoint } from '../theme/breakpoints';

/** Current width class: `phone`, `tablet` or `wide`. */
export function useBreakpoint(): Breakpoint {
  return breakpointFor(useWindowDimensions().width);
}
