import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

import { isUnexpectedApiError } from '../errors/api-error';

import type { ApiError } from '../contracts/api-client.types';

type ErrorNotifier = (error: ApiError) => void;

let errorNotifier: ErrorNotifier | undefined;

export function registerApiErrorNotifier(notifier: ErrorNotifier): () => void {
  errorNotifier = notifier;

  return () => {
    if (errorNotifier === notifier) {
      errorNotifier = undefined;
    }
  };
}

export const apiErrorNotifierMiddleware: Middleware = () => (next) => (action) => {
  const result = next(action);

  if (isRejectedWithValue(action) && isUnexpectedApiError(action.payload)) {
    errorNotifier?.(action.payload);
  }

  return result;
};
