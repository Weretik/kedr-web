import { View } from 'react-native';

import { createStyles, useStyles } from '../../theme/styling/create-styles';
import { AppText } from '../text/app-text';

import type { StatusKind } from '../../theme/tokens/palette';

export interface StatusPillProps {
  kind: StatusKind;
  label: string;
}

/** A problem or state with its word; never an «all OK» badge. */
export function StatusPill({ kind, label }: Readonly<StatusPillProps>) {
  const styles = useStyles(stylesSheet);
  return (
    <View style={styles.pill(kind)}>
      <AppText numberOfLines={1} tone={kind} variant="caption">
        {label}
      </AppText>
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  pill: (kind: StatusKind) => ({
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.status[kind].background,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.space.sm,
    paddingVertical: 2,
  }),
}));
