import { apiErrorNotifierMiddleware, baseApi } from '@mobile/shared/api-client';
import { configureStore } from '@reduxjs/toolkit';

import { themePreferenceReducer } from './theme-preference-state';

export function createAppStore() {
  return configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware, apiErrorNotifierMiddleware),
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      themePreference: themePreferenceReducer,
    },
  });
}

export const appStore = createAppStore();

export type AppDispatch = typeof appStore.dispatch;
export type AppState = ReturnType<typeof appStore.getState>;
