import {
  AppText,
  BrandMark,
  Button,
  Card,
  createStyles,
  TextField,
  useStyles,
} from '@mobile/shared/ui';
import { useRef, useState } from 'react';
import { View, type TextInputInstance } from 'react-native';

import { getLoginErrorMessage } from './login-error-message';
import { AuthFrame } from '../components/auth-frame';
import { login } from '../session/mobile-auth';

/** Sign-in with the Kedr Admin email and password (R-001). */
export function LoginScreen() {
  const styles = useStyles(stylesSheet);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInputInstance>(null);
  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    try {
      await login({ email: email.trim(), password });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthFrame>
      <View style={styles.brand}>
        <BrandMark size={56} />
        <AppText accessibilityRole="header" variant="loginTitle">
          Кедр Менеджер
        </AppText>
        <AppText tone="secondary">Увійдіть тим самим email і паролем, що й в адмінці Кедр.</AppText>
      </View>
      <Card style={styles.form}>
        <TextField
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          label="Email"
          onChangeText={setEmail}
          onSubmitEditing={() => passwordRef.current?.focus()}
          placeholder="name@classkedr.com.ua"
          returnKeyType="next"
          textContentType="username"
          value={email}
        />
        <TextField
          autoComplete="password"
          error={error}
          inputRef={passwordRef}
          label="Пароль"
          onChangeText={setPassword}
          onSubmitEditing={() => void submit()}
          returnKeyType="go"
          secret
          textContentType="password"
          value={password}
        />
        <Button
          disabled={!canSubmit}
          label="Увійти"
          loading={submitting}
          onPress={() => void submit()}
        />
      </Card>
      <AppText align="center" tone="secondary" variant="secondary">
        Без мережі застосунок працює до 7 днів після останнього входу.
      </AppText>
    </AuthFrame>
  );
}

const stylesSheet = createStyles((theme) => ({
  brand: { gap: theme.space.sm },
  form: { gap: theme.space.lg },
}));
