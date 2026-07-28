import { type ReactNode } from 'react';

export function Provider({ children }: { children: ReactNode }) {
  return children;
}

export function useDispatch() {
  return () => undefined;
}

export function useSelector(
  selector: (state: { themePreference: { preference: string } }) => unknown,
) {
  return selector({ themePreference: { preference: 'system' } });
}

export function useStore() {
  return {
    dispatch: () => undefined,
    getState: () => ({}),
    subscribe: () => () => undefined,
  };
}
