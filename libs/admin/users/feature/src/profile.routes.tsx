import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ProfilePage = lazy(() => import('./pages/profile-page'));

/** Path of the signed-in staff member's own page ("Мій кабінет"). */
export const profilePath = '/profile';

export interface ProfileRouteOptions {
  /** From the app: re-reads the session after an own change so the header updates. */
  onProfileChanged: () => Promise<void>;
}

export function createProfileRoutes({ onProfileChanged }: ProfileRouteOptions): RouteObject[] {
  return [
    { path: profilePath.slice(1), element: <ProfilePage onProfileChanged={onProfileChanged} /> },
  ];
}
