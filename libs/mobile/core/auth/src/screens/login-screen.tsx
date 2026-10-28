import { AppScreen } from '@mobile/core/shell';
import { kedrSpace } from '@mobile/shared/ui';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';

import { getLoginErrorMessage } from './login-error-message';
import { login } from '../session/mobile-auth';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.form}>
          <Text accessibilityRole="header" variant="headlineMedium">
            Вхід
          </Text>
          <Text variant="bodyMedium">Увійдіть обліковим записом менеджера Kedr.</Text>
          <TextInput
            accessibilityLabel="Email"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            label="Email"
            mode="outlined"
            onChangeText={setEmail}
            textContentType="username"
            value={email}
          />
          <TextInput
            accessibilityLabel="Пароль"
            autoComplete="password"
            label="Пароль"
            mode="outlined"
            onChangeText={setPassword}
            onSubmitEditing={() => void submit()}
            secureTextEntry
            textContentType="password"
            value={password}
          />
          <HelperText accessibilityLiveRegion="polite" type="error" visible={error !== null}>
            {error}
          </HelperText>
          <Button
            disabled={!canSubmit}
            loading={submitting}
            mode="contained"
            onPress={() => void submit()}
          >
            Увійти
          </Button>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  form: { gap: kedrSpace.md },
});
