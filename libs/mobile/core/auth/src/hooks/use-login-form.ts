import { useState } from 'react';

import { getLoginErrorMessage } from './login-error-message';
import { login } from '../session/mobile-auth';

/** Email, password, and the sign-in request of the login screen (R-001). */
export function useLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = email.trim().length > 0 && password.length > 0 && !submitting;

  const submit = async () => {
    if (!canSubmit) return;
    setError(null);
    setSubmitting(true);

    // No `finally`: React Compiler cannot compile it yet, and both branches end the same way.
    try {
      await login({ email: email.trim(), password });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    }
    setSubmitting(false);
  };

  return { canSubmit, email, error, password, setEmail, setPassword, submit, submitting };
}
