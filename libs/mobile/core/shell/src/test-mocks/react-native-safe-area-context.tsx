import { type ReactNode } from 'react';
import { View } from 'react-native';

export function SafeAreaProvider({ children }: { children: ReactNode }) {
  return children;
}

export function SafeAreaView({ children }: { children: ReactNode }) {
  return <View>{children}</View>;
}

export function useSafeAreaInsets() {
  return { bottom: 0, left: 0, right: 0, top: 0 };
}
