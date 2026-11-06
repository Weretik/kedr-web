import { lazy } from 'react';

import type { RouteObject } from 'react-router-dom';

const ArticlesPage = lazy(() => import('./pages/articles-page'));
const ArticleEditorPage = lazy(() => import('./pages/article-editor-page'));

/** Open to every staff role (Manager, Seo, and Admin), as the backend policy CanManageContent. */
export const articlesRoutes: RouteObject[] = [
  { path: 'articles', element: <ArticlesPage /> },
  // `new` is matched by the same route; the page tells it from a numeric id.
  { path: 'articles/:articleId', element: <ArticleEditorPage /> },
];
