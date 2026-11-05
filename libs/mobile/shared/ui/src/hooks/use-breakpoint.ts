import { useUnistyles } from 'react-native-unistyles';

import type { Breakpoint } from '../theme/breakpoints';

/** Current width class; `phone` until Unistyles reports one. */
export function useBreakpoint(): Breakpoint {
  const { rt } = useUnistyles();

  return (rt.breakpoint as Breakpoint | undefined) ?? 'phone';
}
