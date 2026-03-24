import { Route } from '@angular/router';

export const storefrontFeatureArticlesRoutes: Route[] = [
  {
    path: 'articles',
    loadComponent: () =>
      import('./pages/article-list/article-list.page').then(
        (m) => m.ArticleListPage,
      ),
  },
  {
    path: 'articles/:id',
    loadComponent: () =>
      import('./pages/article-detail/article-detail.page').then(
        (m) => m.ArticleDetailPage,
      ),
  },
];
