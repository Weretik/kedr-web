import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

const defaultEdges: readonly Edge[] = ['top', 'right', 'bottom', 'left'];

export interface AppScreenProps {
  children: ReactNode;
  edges?: readonly Edge[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function AppScreen({
  children,
  edges = defaultEdges,
  style,
  testID,
}: Readonly<AppScreenProps>) {
  const theme = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={[styles.content, style]} testID={testID}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  safeArea: {
    flex: 1,
  },
});
