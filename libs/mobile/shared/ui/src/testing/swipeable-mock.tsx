import type { ReactNode } from 'react';

// Reanimated does not start under Jest: a swipeable row renders its content and its actions side by side.
jest.mock('react-native-gesture-handler/ReanimatedSwipeable', () => {
  const { View: MockView } = jest.requireActual<typeof import('react-native')>('react-native');
  return {
    __esModule: true,
    default: ({
      children,
      renderRightActions,
    }: {
      children: ReactNode;
      renderRightActions?: () => ReactNode;
    }) => (
      <MockView>
        {children}
        {renderRightActions?.()}
      </MockView>
    ),
  };
});
