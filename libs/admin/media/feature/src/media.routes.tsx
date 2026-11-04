import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const MediaPage = lazy(() => import('./pages/media-page'));

export interface MediaRoutesOptions {
  /** The app says whether the signed-in role may delete (Admin), as the backend policy. */
  useCanDelete: () => boolean;
}

/** `/media` is open to every staff role (Manager and Admin), as the backend policy CanManageMedia. */
export function createMediaRoutes({ useCanDelete }: MediaRoutesOptions): RouteObject[] {
  function MediaRoute() {
    return <MediaPage canDelete={useCanDelete()} />;
  }
  return [{ path: 'media', element: <MediaRoute /> }];
}
