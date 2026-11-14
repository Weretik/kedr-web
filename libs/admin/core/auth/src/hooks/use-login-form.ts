import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getLoginErrorMessage } from '../pages/login-error-message';
import { login } from '../session/auth-session';

import type { FormEvent } from 'react';

/** The sign-in form: fields, the request, its error, and the return to the asked page. */
export function useLoginForm(returnPath: string) {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: values.email.trim(), password: values.password });
      navigate(returnPath, { replace: true });
    } catch (loginError) {
      setError(getLoginErrorMessage(loginError));
    }
    setSubmitting(false);
  };

  return {
    ...values,
    error,
    submitting,
    canSubmit: !submitting && Boolean(values.email.trim()) && Boolean(values.password),
    setEmail: (email: string) => setValues((current) => ({ ...current, email })),
    setPassword: (password: string) => setValues((current) => ({ ...current, password })),
    submit,
  };
}
