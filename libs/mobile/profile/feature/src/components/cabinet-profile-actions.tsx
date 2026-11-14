import { Button, createStyles, useStyles } from '@mobile/shared/ui';
import { View } from 'react-native';

import type { CabinetEditing } from '../hooks/use-cabinet-profile';

interface CabinetProfileActionsProps {
  online: boolean;
  /** An Admin also changes the sign-in e-mail and password. */
  isAdmin: boolean;
  onOpen: (editing: CabinetEditing) => void;
}

/** The buttons that open the name, e-mail, and password forms of the cabinet. */
export function CabinetProfileActions({
  isAdmin,
  onOpen,
  online,
}: Readonly<CabinetProfileActionsProps>) {
  const styles = useStyles(stylesSheet);

  return (
    <View style={styles.actions}>
      <Button
        disabled={!online}
        label="Змінити імʼя"
        onPress={() => onOpen('name')}
        variant="outlined"
      />
      {isAdmin ? (
        <>
          <Button
            disabled={!online}
            label="Змінити e-mail"
            onPress={() => onOpen('email')}
            variant="outlined"
          />
          <Button
            disabled={!online}
            label="Змінити пароль"
            onPress={() => onOpen('password')}
            variant="outlined"
          />
        </>
      ) : null}
    </View>
  );
}

const stylesSheet = createStyles((theme) => ({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.space.sm },
}));
