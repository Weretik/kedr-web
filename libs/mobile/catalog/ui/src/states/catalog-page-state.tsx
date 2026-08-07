import { StyleSheet, View } from 'react-native';

import { CatalogState, type CatalogStateKind } from './catalog-state';

export interface CatalogPageStateProps {
  actionAccessibilityLabel?: string;
  actionLabel?: string;
  kind: CatalogStateKind;
  onAction?: () => void;
  onRetry?: () => void;
}

export function CatalogPageState({
  actionAccessibilityLabel,
  actionLabel,
  kind,
  onAction,
  onRetry,
}: Readonly<CatalogPageStateProps>) {
  return (
    <View style={styles.page} testID="catalog-screen">
      <CatalogState
        actionAccessibilityLabel={actionAccessibilityLabel}
        actionLabel={actionLabel}
        kind={kind}
        onAction={onAction}
        onRetry={onRetry}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
