import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const GalleryPage = lazy(() => import('./pages/gallery-page'));

/** Open to every staff role (Manager, Seo, and Admin), as the backend policy CanManageContent. */
export const galleryRoutes: RouteObject[] = [{ path: 'gallery', element: <GalleryPage /> }];
